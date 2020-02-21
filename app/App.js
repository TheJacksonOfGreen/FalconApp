import React, { Component } from 'react';
import Section from './screens/Section';
import SectionList from './screens/SectionList';
import Article from './screens/Article';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
	SectionList: {screen: SectionList},
	Section: {screen: Section},
	Article: {screen: Article},
});

const App = createAppContainer(MainNavigator);

export default App;
