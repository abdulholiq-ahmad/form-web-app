import { useQuery } from "react-query";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const FormComponent = () => {
  const [language] = useState("ru");
  const [formId] = useState("671b41ff6c7de79c95d1fdd0");
  const [answers, setAnswers] = useState([]);

  const { toast } = useToast();

  const fetchForm = async () => {
    const response = await axios.get(`http://192.168.24.142:3003/api/get-survey/${formId}/${language}`);
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery(["form", formId, language], fetchForm);

  if (isLoading) return <h2>Please wait a minute...</h2>;
  if (isError) return <h2>Error: {error.message}</h2>;

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((ans) => ans.questionId !== questionId);
      updatedAnswers.push({ questionId, ...answer });
      return updatedAnswers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyTextQuestions = data.questions
      .filter((question) => question.questionType === "text")
      .some((question) => {
        const answer = answers.find((ans) => ans.questionId === question._id);
        return !answer || !answer.answerText || answer.answerText.trim() === "";
      });

    if (emptyTextQuestions) {
      return toast({
        variant: "destructive",
        title: "Empty text questions",
        description: "Please answer all questions",
      });
    }

    const newAnswer = {
      user: "user_id_here",
      language,
      formId,
      answers,
    };

    console.log(newAnswer);

    setAnswers([]);
    e.target.reset();
  };
  return (
    <div className="container py-5">
      <div className="mb-3">
        <h2 className="text-2xl font-bold">{data.title}</h2>
        <p className="text-xl text-gray-600">{data.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start justify-center">
        {data.questions.map((question) => (
          <div key={question._id}>
            <input type="text" defaultValue={question._id} name="questionId" className="sr-only" />
            <h3 className="text-lg font-semibold">{question.questionText}</h3>

            {question.questionType === "dropdown" && (
              <Select onChange={(value) => handleAnswerChange(question._id, { answerText: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((opt) => (
                    <SelectItem key={opt} defaultValue={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {question.questionType === "radio" && (
              <RadioGroup
                value={answers.find((ans) => ans.questionId === question._id)?.selectedOption || ""}
                onValueChange={(value) => handleAnswerChange(question._id, { selectedOption: value })}
              >
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem id={option} value={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.questionType === "checkbox" && (
              <div className="flex flex-col gap-2">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      value={option}
                      onCheckedChange={(checked) => {
                        const currentAnswer = answers.find((ans) => ans.questionId === question._id);
                        const selectedOptions = currentAnswer ? currentAnswer.selectedOptions : [];

                        if (checked) {
                          selectedOptions.push(option);
                        } else {
                          const index = selectedOptions.indexOf(option);
                          if (index > -1) {
                            selectedOptions.splice(index, 1);
                          }
                        }

                        handleAnswerChange(question._id, { selectedOptions });
                      }}
                    />
                    <Label className="text-base" htmlFor={option}>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.questionType === "text" && (
              <Input type="text" placeholder="Answer" onChange={(e) => handleAnswerChange(question._id, { answerText: e.target.value })} />
            )}
          </div>
        ))}
        <Button disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default FormComponent;
