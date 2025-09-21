import React from "react";
import { Form } from "react-bootstrap";

const FileActionsSelector = ({ selectedActions = [], onChange }) => {
    const allActions = ["SAVE", "SAVE_AS", "SAVE_ALL", "EXIT"];

    const handleToggle = (action) => {
        if (selectedActions.includes(action)) {
            onChange(selectedActions.filter((a) => a !== action));
        } 
        else {
            onChange([...selectedActions, action]);
        }
    };

    return (
        <div>
            {allActions.map((action) => (
                <Form.Check
                key={action}
                type="checkbox"
                id={`action-${action}`}
                label={action}
                checked={selectedActions.includes(action)}
                onChange={() => handleToggle(action)}
                />
            ))}
        </div>
    );
};

export default FileActionsSelector;
