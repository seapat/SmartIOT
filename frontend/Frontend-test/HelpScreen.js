import {
  useTheme
} from '@react-navigation/native';
import React from "react";
import { View, ScrollView } from 'react-native';
import { DataTable, Text, List, Subheading, Headline } from 'react-native-paper';
import styles from './Styles.js'

const HelpScreen = ({ navigation, route }) => {

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  const createTableRow = (Index, First, Second) => {
    return { Index, First, Second };
  }

  const iaqTableRows = [
    createTableRow('0-50', "Excellent", "Pure air; best for well-being"),
    createTableRow('51-100', "Good", "No irritation or Impact on well-being"),
    createTableRow('101-150', "Lightly polluted", "Reduction of well-being possible"),
    createTableRow('151-200', "Moderatly Polluted", "More significant irritation possible"),
    createTableRow('201-250', "Heavily Polluted", "Exposition might lead to effects like headache depending on type of VOCs"),
    createTableRow('251-350', "Severly Polluted", "More severe health issue possible if harmfull VOC present"),
    createTableRow('> 351', "Extremely Polluted", "Headaches, additional neurotoxic effects possbile"),
  ];

  const co2TableRows = [ // https://doi.org/10.1051/e3sconf/20171700073
    createTableRow('350-400 ppm', "Fresh air, perfect conditions ", ""),
    createTableRow('< 600 ppm', "Acceptable conditions of indoor air quality in rooms ", ""),
    createTableRow('1 000 ppm', "The upper limit of fresh air ", ""),
    createTableRow('1 500 ppm', "Air perceived as stuffy and not fresh", ""),
    createTableRow('2 000 ppm ', "People with respiratory illnesses may receive cough, weakened people may faint ", ""),
    createTableRow('> 10 000 ppm', "Bad air quality causes increased breathing rates, problems with respiration, headaches, nausea ", ""),
  ];

  console.log("Help activated from" + route.params.from);
  return ({ // Js object with different origins as keys
    "Login": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Help or something, activated from: {route.params.from}</Text>
      </View>
    ),
    "Monitoring": (
      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>VOC = Volatile Organic Compounds</Text>

        <DataTable style={{ alignSelf: 'center', flex: 1 }} >
          <DataTable.Header>
            <DataTable.Title ><Text>IAQ Index</Text></DataTable.Title>
            <DataTable.Title ><Text>Air Quality</Text></DataTable.Title>
            <DataTable.Title ><Text>Impact</Text></DataTable.Title>
          </DataTable.Header>
          {iaqTableRows.map((row) => (
            <DataTable.Row key={row.Index}>
              <DataTable.Cell><Text>{row.Index}</Text></DataTable.Cell>
              <DataTable.Cell><Text>{row.First}</Text></DataTable.Cell>
              <DataTable.Cell><Text>{row.Second}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        <DataTable style={{ alignSelf: 'center', flex: 1 }} >
          <DataTable.Header>
            <DataTable.Title ><Text>CO2 concentration</Text></DataTable.Title>
            <DataTable.Title ><Text>Air Quality</Text></DataTable.Title>
          </DataTable.Header>
          {co2TableRows.map((row) => (
            <DataTable.Row key={row.Index}>
              <DataTable.Cell><Text >{row.Index}</Text></DataTable.Cell>
              <DataTable.Cell><Text >{row.First}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

      </View>
    ),
    "Events": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <List.Item description="This page is allows you to view statistics about the measurements of your devices over time." />
        <Text>Help or something, activated from: {route.params.from}</Text>
      </View>
    ),
    "Home": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Help or something, activated from: {route.params.from}</Text>
      </View>
    ),
    "Alarm": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView >
          <List.Item description="This page is warns you about risk of mold or other circumstances based on your current mode. You can read some tips about improving your Air quality below." />
          <Headline>Air Quality tips</Headline>
          <List.Accordion title="Humidity" >
            <List.Item description="- lower temperature leads to rise in relative humidity due to lower water absorption capacity" />
            <List.Item description="- Place 'Hydrophilic granules' in a bowl in your room. They will absorb water from the air. (Alternatives: rice, cat litter, table salt)" />
            <List.Item description="- Use a dehumidifier." />
            <List.Item description="- Insulation materials also play a role." />
            <List.Item description="- he arrangement of the home furniture can promote mold growth" />
          </List.Accordion>

          <List.Accordion title="Mold" >
            <Subheading>Optimal Conditions</Subheading>
            <List.Item description="- Room temperature: 19°C-21°C (Never under 16°C)" />
            <List.Item description="- Humidity: under 60% relative humidity" />
            <Subheading>Prevention tips</Subheading>
            <List.Item description="- Corners, windows and outer walls in rooms are colder if the temperature difference between in- and outside is high." />
            <List.Item description="- Keep your doors closed, especially if the room tempartue between rooms differs" />
            <List.Item description="- Heat rooms even when not in use so that walls do not get too cold" />
            <List.Item description="- Keep your windows closed (completely) while heating your room" />
            <List.Item description="- Ventilate rooms at least 3-4 times a day" />
            <List.Item description="- Don’t dry your laundry in your house/flat, compensate by ventilating more often." />
            <List.Item description="- Postion big pieces of furniture at least 5 cm away from any walls" />
            <List.Item description="- After showering or cooking, keep the doors closed to keep the higher humidity local" />
            <List.Item description="- Do not keep moist soil used for poting indoors." />
            <List.Item description="- Don't store firewood in your livin rooms, use a cellar for example." />
            <List.Item description="- Dont place your Dryer and washing machine in the same room" />
            <List.Item description="- Don't ventilate your cellar if the outside air is warmer than the inside one" />
            <Subheading>How to ventialte properly</Subheading>
            <List.Item description="- Bedroom: in the morning after getting up" />
            <List.Item description="- Bathroom: Immediately after showering and bathing" />
            <List.Item description="- Kitchen: During and after cooking" />
            <List.Item description="- Apartment: all rooms before going to bed" />
            <List.Item description="- The duration varies dependent on the temperature outside" />
            <List.Item description="- 5°C: <5 min   <10°C: <10 min   <15°C: <15 min   >15°C: any amount" />
          </List.Accordion>

          <List.Accordion title="CO2" >
            <Subheading>Preventions:</Subheading>
            <List.Item description="- frequent Ventilation" />
            <Subheading>General Information:</Subheading>
            <List.Item description="- CO2 is an indicator of the quality of the indoor air in the rooms as a whole " />
            <List.Item description="- The risk of infection increases with the CO2 content" />
            <List.Item description="- A 3.5 to 4 square meter enclosed space with a single person, the CO2 content goes from 500 ppm to over in just 45 minutes 1000 ppm increase." />
            <List.Item description="- Outside air is around 400 ppm" />
            <List.Item description="- Human breath about 30,000 ppm" />
            <List.Item description="- More than 20,000 ppm can cause a cough" />
            <List.Item description="- Optimal room climate maximum 1030 ppm" />
          </List.Accordion>

          <List.Accordion title="Optimal Sleep" >
            <Subheading>ideal Parameters:</Subheading>
            <List.Item description="- Room temperature: 16°C-18°C " />
            <List.Item description="- Humidity: 55%- 65% relative humidity" />
            <List.Item description="- Co2: under 1000 ppm" />
            <Subheading>Preventions:</Subheading>
            <List.Item description="- Bedroom should be quiet (if possible, the room is not on the street side)" />
            <List.Item description="- Ventilate well before going to sleep" />
            <List.Item description="- Banish cut flowers or potted plants from the bedroom (unhealthy carbon dioxide)" />
          </List.Accordion>

        </ScrollView >
      </View>
    ),
    "Settings": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Help or something, activated from: {route.params.from}</Text>
      </View>
    ),
    "CreateAlarm": (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Help or something, activated from: {route.params.from}</Text>
      </View>
    )
  })[route.params.from]; // get diff. screen based on origin from which we pressed the help button
}

export default HelpScreen;
