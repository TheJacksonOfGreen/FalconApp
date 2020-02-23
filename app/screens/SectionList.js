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
		title: '',
		headerTitle: <Image style={{height:40, resizeMode:'contain'}} source={require('./falconLogo.png')}/>,
	};
	constructor (props) {
		super(props)
		this.state = {section:"", storyList:[], fetched:false}
	}
	componentDidMount () {
		const { navigation } = this.props;
		fetch('https://www.saratogafalcon.org')
		.then((response) => response.text())
		.then((responseText) => {
			var root = HTMLParser.parse(responseText)
			// For ID use pound symbol
			// For Class use dot
			var teaserList = root.querySelectorAll('.spotlight_story')
			var parsedTeaserList = []
			var tHead = ''
			var tDesc = ''
			var tImgUrl = ''
			var tStoryLink = 'https://www.saratogafalcon.org/content/problem-while-fetching-story-0'
			var parsedTeaser = {}
			for (var i = 0; i < teaserList.length; i++) {
				tHead = teaserList[i].querySelector('.spotlight_title').rawText
				tDesc = teaserList[i].querySelector('.spotlight_text').rawText.split('read more &raquo;').shift().trim()
				tStoryLink = 'https://www.saratogafalcon.org' + teaserList[i].querySelector('.spotlight_title').firstChild.attributes['href']
				try {
					tImgUrl = teaserList[i].querySelector('.spotlight_image').lastChild.attributes['src']
				} catch {
					tImgUrl = ''
				}
				parsedTeaser = {headline:tHead, description:tDesc, imageLink:tImgUrl, storyLink:tStoryLink}
				parsedTeaserList.push(parsedTeaser)
			}
			this.setState(previousState => ({
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
					<View style={styles.spotlightViewStyle}>
						<Button color='#010101' title="Loading..."></Button>
					</View>
					<View style={styles.sectionListStyle}>
						<Button color='#a00000' title="News" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/news', pageTitle:'News'})}></Button>
						<Button color='#a00000' title="Opinion" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/opinion', pageTitle:'Opinion'})}></Button>
						<Button color='#a00000' title="Features" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/features', pageTitle:'Features'})}></Button>
						<Button color='#a00000' title="Sports" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/sports', pageTitle:'Sports'})}></Button>
						<Button color='#a00000' title="Columns" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/columns', pageTitle:'Columns'})}></Button>
					</View>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<View style={styles.spotlightViewStyle}>
						<FlatList style={styles.flatListStyle} data={this.state.storyList}
						renderItem={({item}) => <TouchableOpacity onPress={() => navigate('Article', {storyLink: item.storyLink})}> 
								<RenderRow headline={item.headline} description={item.description} imageLink={item.imageLink}></RenderRow>
							</TouchableOpacity>}
						keyExtractor={(item, index) => index.toString()} />
					</View>
					<View style={{height: 1, backgroundColor: '#A3A1A1'}}></View>
					<View style={styles.sectionListStyle}>
						<Button color='#a00000' title="News" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/news', pageTitle:'News'})}></Button>
						<Button color='#a00000' title="Opinion" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/opinion', pageTitle:'Opinion'})}></Button>
						<Button color='#a00000' title="Features" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/features', pageTitle:'Features'})}></Button>
						<Button color='#a00000' title="Sports" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/sports', pageTitle:'Sports'})}></Button>
						<Button color='#a00000' title="Columns" onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/columns', pageTitle:'Columns'})}></Button>
					</View>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 0,
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'stretch',
		backgroundColor: '#FFFFFF'
	}, 
	sectionListStyle: {
		flex: 1,
		justifyContent: 'flex-start', 
		alignItems: 'flex-start',
	}, 
	spotlightViewStyle: {
		flex:2, 
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
	}
})