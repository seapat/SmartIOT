import React from "react";
import { Button, Menu, useTheme, } from 'react-native-paper';


/**
 * @callback onSelect
 * @param {string} selectedData
 * @param {number} index
 */
/**
 * Small dropdown component based on react-native paper since the old one did not work with the web.
 * @param {{data:Array<String>, defaultValue: string, defaultValueByIndex: number, onSelect:onSelect}} props 
 * @returns 
 */
const Dropdown = props => {
const [visible, setVisible] = React.useState(false);
const openMenu = () => setVisible(true);
const closeMenu = () => setVisible(false);
const theme = useTheme();

var [value, setValue] = React.useState(props.defaultValue || props.data[props.defaultValueByIndex]);

let data = [], dataEmpty = true;
for(let i = 0; i < props.data.length; i++){ 
    dataEmpty = false;
    data.push(<Menu.Item key={i} onPress={() => {setValue(props.data[i]); closeMenu(); props.onSelect(props.data[i], i)}} title={props.data[i]} />);
}

// Only way defaultValueByIndex seems to work..
if(!dataEmpty && value == undefined) {  
    setValue(props.defaultValue || props.data[props.defaultValueByIndex]);
}

return (<Menu
    visible={visible}
    theme={theme}
    onDismiss={closeMenu}
    anchor={<Button onPress={openMenu}>{value}</Button>}>
    {data}
</Menu>);
}

export default Dropdown;