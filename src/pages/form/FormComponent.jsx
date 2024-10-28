import { useQuery } from "react-query";
import Button from "../../components/button/Button";
import "./FormComponent.css";
import axios from "axios";

const Form = () => {
  const fetchForms = async (keyId, language) => {
    const response = await axios.get(`http://192.168.24.142:3003/api/get-survey/${keyId}/${language}`);
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery(
    ["forms", "671b41ff6c7de79c95d1fdd0", "ru"],
    () => fetchForms("671b41ff6c7de79c95d1fdd0", "ru"),
    { keepPreviousData: true }
  );

  console.log(data);

  if (isLoading) {
    <h2>Please wait a minute</h2>;
  }

  return (
    <div className="container">
      <h1 className="title">{data?.title}</h1>
      <p className="description">{data?.description}</p>
      <Button text="Submit" />
    </div>
  );
};

export default Form;
