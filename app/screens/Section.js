import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';

import {
	StyleSheet, 
	Text, 
	Image, 
	ScrollView,
	FlatList, 
	TouchableOpacity,
	View
} from 'react-native';

export class RenderRow extends Component {
	constructor (props) {
		super(props)
		this.state = {headline:this.props.headline, description:this.props.description, imageLink:this.props.imageLink}
	}
	componentDidMount () {}
	render () {
		if (this.state.imageLink != '') {
			picture = <View style={styles.rowImageContainer}><Image style={{width:100, height:100}} source={{uri: this.state.imageLink}} /></View>
		} else {
			picture = <View style={styles.rowImageContainer}></View>
		}
		return (
			<View style={styles.rowContainer}>
				{ picture }
				<View style={styles.rowTextContainer}>
					<Text style={styles.headlineText}>{ this.state.headline }</Text>
					<Text style={styles.descriptionText}>{ this.state.description }</Text>
				</View>
			</View>
		);
	}
}

export default class TestPage extends Component {
	static navigationOptions = {
		title: 'News',
	};
	constructor (props) {
		super(props)
		this.state = {section:"", storyList:[], fetched:false}
	}
	componentDidMount () {
		const { navigation } = this.props;
		fetch(navigation.getParam('storyLink', ''))
		.then((response) => response.text())
		.then((responseText) => {
			var root = HTMLParser.parse(responseText)
			// For ID use pound symbol
			// For Class use dot
			var teaserList = root.querySelectorAll('.falcon_story_teaser')
			var parsedTeaserList = []
			var tHead = ''
			var tDesc = ''
			var tImgUrl = ''
			var tStoryLink = 'https://www.saratogafalcon.org/content/problem-while-fetching-story-0'
			var parsedTeaser = {}
			for (var i = 0; i < teaserList.length; i++) {
				tHead = teaserList[i].querySelector('.teaser_header').rawText
				tDesc = teaserList[i].querySelector('.teaser .content').rawText
				tStoryLink = 'https://www.saratogafalcon.org' + teaserList[i].querySelector('.teaser_header').firstChild.attributes['href']
				try {
					tImgUrl = teaserList[i].querySelector('.teaser_image').firstChild.firstChild.attributes['src']
				} catch {
					tImgUrl = ''
				}
				parsedTeaser = {headline:tHead, description:tDesc, imageLink:tImgUrl, storyLink:tStoryLink}
				parsedTeaserList.push(parsedTeaser)
			}
			this.setState(previousState => ({
				section:root.querySelector('#page-title').text.trim(), 
				storyList:parsedTeaserList,
				fetched:true
			}))
		})
		.catch((error) => {
		  console.error(error);
		});
	}
	render () {
		const {navigate} = this.props.navigation;
		if (!this.state.fetched) {
			return (
				<View style={styles.container}>
					<Text style={styles.categoryText}>
						Loading...
					</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<View style={styles.stationaryImageView}>
						<Image source={require('./download.png')} />
					</View>
					<FlatList style={styles.flatListStyle} data={this.state.storyList} 
					renderItem={({item}) => <TouchableOpacity onPress={() => navigate('Article', {storyLink: item.storyLink})}> 
							<RenderRow headline={item.headline} description={item.description} imageLink={item.imageLink}></RenderRow>
						</TouchableOpacity>}
					keyExtractor={(item, index) => index.toString()} />
				</View>
			);
		}
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