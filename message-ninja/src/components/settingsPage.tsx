import React, { useState, ChangeEvent, FormEvent } from 'react';
import { storeVariableMessage} from '../types';
import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';
import "../App.css"
interface settingsPageProps {
    changeSettings: (arg0: boolean) => void,
    setAPIKey: (arg0: string) => void
    getMessage: (arg0: string) => void
}

export const SettingsPage = (props: settingsPageProps) => {

    const [inputValue, setInputValue] = useState<string>('');
    const [labelValue, setLabelValue] = useState<string>('Enter API Key:')

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    };

    
    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log('Submitted value:', inputValue);
        if (inputValue.length === 51 && inputValue.slice(0, 2) === "sk"){

            const toSend: storeVariableMessage = {
                type: "storeVariable",
                key: "APIKey",
                value: inputValue,
            }

            sendMessageToBackgroundScript(toSend)

            props.setAPIKey(inputValue)
            props.getMessage(inputValue)
            props.changeSettings(true)
            setInputValue('');

            } else {
            setInputValue("")
            setLabelValue("not an API key")

            }
        }

   



    return (
    
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            id="inputBox"
            placeholder={labelValue}
            value={inputValue}
            onChange={handleChange}
        />
        
        <button type="submit" className="button2">Submit</button>
    </form>
    
    );
}
    