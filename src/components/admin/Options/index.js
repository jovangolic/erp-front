import React from "react";
import OptionList from "./OptionList";
import EditOptManager from "./EditOptManager";

const OptionsIndex = () => {
  return (
    <div>
      <h1>Upravljanje Opcijama</h1>
      <OptionList />
      <hr />
      <EditOptManager />
    </div>
  );
};

export default OptionsIndex;