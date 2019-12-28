import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';

import {
	StyleSheet, 
	Button,
	View
} from 'react-native';

export default class TestPage extends Component {
	static navigationOptions = {
		title: 'Welcome',
	};
	constructor (props) {
		super(props)
		console.log("Starting Up!")
	}
	componentDidMount () {}
	render () {
		const {navigate} = this.props.navigation;
		return (
			<View style={styles.container}>
				<Button title="Make it Blue!" onPress={() => navigate('DummyBlue')}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FF0000',
		alignSelf: "stretch"
	}
})