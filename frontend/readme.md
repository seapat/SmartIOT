Frontend-test is the test version. Currently has some barebone design with no real functionality.

Installs done for this app:

npm install -g expo-cli  
npm install @react-navigation/bottom-tabs  
npm install @react-navigation/native  
npm install react-native-screens  
npm install @react-navigation/stack  
npm install @react-native-community/masked-view  
npm install react-native-gesture-handler  
npm install react-native-keychain
npm install axios  

started via (in folder):  

npm start  

Current Problems:  
Buttons don't work for unknown reasons, they worked before but don't atm and I cannot figure out why even after checking for a long time.  
Can anyone figure it out?  

Design will mainly be done with flexbox (based on current understanding), works by first specifying rows then columns atm via nesting.  
The main pages are in a tab navigator which lets you navigate them via tabs at the bottom, this is nested inside a stack navigator which is used for the help button at the top right of every window  
(If Buttons worked, like they used to..)  

Design is not finished, mainly cause still unsure why buttons don't work and I don't really want to proceed before figuring it out.  

Dropdown menus are odd, trying to figure out why I cannot make the text to the left of it actually next to it (align right does not seem to work?).  

