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
import SkeletonForm from "@/components/skeleton/SkeletonForm";
import Logo from "@/assets/logo-icon.svg";

const FormComponent = () => {
  const [language] = useState("ru");
  const [formId] = useState("671b41ff6c7de79c95d1fdd0");
  const [answers, setAnswers] = useState([]);
  const [emptyQuestions, setEmptyQuestions] = useState([]);

  const fetchForm = async () => {
    const response = await axios.get(`http://192.168.24.142:3003/api/get-survey/${formId}/${language}`);
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery(["form", formId, language], fetchForm);

  if (isError) return <h2>Error: {error.message}</h2>;

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((ans) => ans.questionId !== questionId);

      if (answer.selectedOptions) {
        updatedAnswers.push({
          questionId,
          selectedOptions: Array.isArray(answer.selectedOptions) ? answer.selectedOptions : [answer.selectedOptions],
        });
      } else {
        updatedAnswers.push({ questionId, ...answer });
      }

      return updatedAnswers;
    });
  };

  const postData = async (data) => {
    const response = await axios.post("http://192.168.24.142:3003/api/post-survey", data);
    return response.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmptyQuestions = data.questions.filter((question) => {
      const answer = answers.find((ans) => ans.questionId === question._id);

      if (question.questionType === "text") {
        return !answer || !answer.answerText || answer.answerText.trim() === "";
      }

      if (question.questionType === "radio") {
        // O'zgarish: `selectedOptions` ga tekshirish
        return !answer || !answer.selectedOptions || answer.selectedOptions.length === 0;
      }

      if (question.questionType === "checkbox") {
        return !answer || !answer.selectedOptions || answer.selectedOptions.length === 0;
      }

      return false;
    });

    setEmptyQuestions(newEmptyQuestions);

    if (newEmptyQuestions.length > 0) {
      return;
    }

    const newAnswer = {
      user: 5570713259,
      language,
      formId,
      answers,
    };

    postData(newAnswer);
    console.log(newAnswer);
    setAnswers([]);
    e.target.reset();
  };

  const handleResetInputAnswer = (questionId) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((ans) => ans.questionId !== questionId);
      return updatedAnswers;
    });
  };

  return (
    <>
      {isLoading ? (
        <SkeletonForm />
      ) : (
        <div className="w-full h-full pb-10 bg-[#e8eeee]">
          <div className="container py-5 flex flex-col items-center gap-8 justify-center font-raleway max-w-[580px]">
            <div className="flex flex-col p-5 pb-10 rounded-xl">
              <div className="bg-white p-5 rounded-xl mb-5">
                <div className="flex items-center justify-between mb-5 bg-white">
                  <img src={Logo} alt="" width={50} />

                  <h2 className="font-semibold flex flex-col text-[#022226] leading-3 uppercase text-sm text-center">
                    <span className="text-[#ffaf35] text-lg">UMFT</span>
                    Form
                  </h2>
                </div>
                <div>
                  <h2 className="text-4xl mb-2 font-semibold text-[#0b272b]">{data?.title}</h2>
                  <p className="text-sm tracking- text-gray-600 font-light">{data?.description}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-start justify-center">
                {data?.questions?.map((question) => (
                  <div key={question?._id} className="w-full">
                    <input type="text" defaultValue={question._id} name="questionId" className="sr-only" />
                    <div className="p-5 rounded-xl bg-white">
                      <h3
                        className={`${
                          question?.questionType === "text" ? "" : "mb-5 border-b border-gray-300 pb-2"
                        } text-base font-medium text-gray-700`}
                      >
                        {question?.questionText}
                        {emptyQuestions.some((q) => q._id === question._id) && <span className="text-red-400"> *</span>}
                      </h3>

                      {question.questionType === "dropdown" && (
                        <Select onChange={(value) => handleAnswerChange(question._id, { answerText: value })}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question?.options.map((opt) => (
                              <SelectItem key={opt} defaultValue={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {question?.questionType === "radio" && (
                        <RadioGroup
                          value={answers.find((ans) => ans.questionId === question._id)?.selectedOptions[0] || ""}
                          onValueChange={(value) => handleAnswerChange(question._id, { selectedOptions: [value] })}
                        >
                          {question.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem id={option} value={option} />
                              <Label className="text-gray-600 text-sm cursor-pointer" htmlFor={option}>
                                {option}
                              </Label>
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
                              <Label className="text-sm text-gray-600" htmlFor={option}>
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.questionType === "text" && (
                        <div className="w-full mt-5">
                          <Input
                            className="mt-2 w-full border-b border-gray-300 shadow-none focus-within:ring-0 focus-within:border-[#ffaf35] focus-within:border-b-2 focus-visible:ring-none placeholder:text-gray-400/70"
                            type="text"
                            placeholder="Enter your answer ..."
                            onChange={(e) => handleAnswerChange(question._id, { answerText: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button className="py-5 ml-auto text-sm bg-[#022226] hover:bg-[#022226]/90" disabled={isLoading} type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormComponent;
