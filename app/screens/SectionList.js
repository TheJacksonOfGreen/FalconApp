import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';

import {
	StyleSheet, 
	Text, 
	Image, 
	ScrollView,
	FlatList, 
	TouchableOpacity,
	View,
	Button
} from 'react-native';

export default class TestPage extends Component {
	static navigationOptions = {
		title: 'Welcome',
	};
	constructor (props) {
		super(props)
		this.state = {section:"", storyList:[], fetched:false}
	}
	render () {
		const {navigate} = this.props.navigation;
		return (
			<View style={styles.container}>
				<View style={styles.stationaryImageView}>
					<Image source={require('./download.png')} />
				</View>
				<Button title="News" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/news'})}></Button>
				<Button title="Opinion" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/opinion'})}></Button>
				<Button title="Features" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/features'})}></Button>
				<Button title="Sports" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/sports'})}></Button>
				<Button title="Columns" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/columns'})}></Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 30,
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF'
	}, 
	flatListStyle: {
		alignSelf: "stretch"
	},
	rowContainer: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start', 
		alignItems: 'center',
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 5,
		marginTop: 0,
		marginBottom: 5
	}, 
	rowImageContainer: {
		marginRight: 5
	}, 
	rowTextContainer: {
		flex: 1,
		flexDirection: "column",
	}, 
	stationaryImageView: {
		paddingVertical: 45,
		paddingBottom: 25, 
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'flex-start',
	},
	categoryText: {
		fontSize: 40, 
		textAlign: 'auto',
		color: '#000000', 
		margin: 10
	},
	headlineText: {
		flex: 0,
		includeFontPadding: false,
		fontSize: 20, 
		textAlignVertical: "top",
		color: '#A00000', 
		margin: 10
	},
	descriptionText: {
		flex: 0,
		includeFontPadding: false,
		textAlignVertical: "bottom",
		fontSize: 18, 
		color: '#120000', 
		margin: 10
	},
	caption: {
		fontSize: 12, 
		textAlign: 'auto',
		color: '#9E9E9E', 
		margin: 10
	},
	imageStyle: {
		flex: 1,
		width: '100%', 
		height: undefined,
		aspectRatio: 1,
		resizeMode: 'contain'
	}
})