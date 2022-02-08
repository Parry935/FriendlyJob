import Loader from "react-loader-spinner";

export function showLoader() {
  return (
    <div className="center-absolute-app">
      <Loader type="TailSpin" color="#00BFFF" height={200} width={200} />
    </div>
  );
}
