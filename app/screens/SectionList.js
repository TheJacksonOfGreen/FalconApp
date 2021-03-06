import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';

import {
	StyleSheet, 
	Text, 
	Image, 
	FlatList, 
	TouchableOpacity,
	View,
	ScrollView,
	Button
} from 'react-native';

var decodeHTMLEntity = function(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};

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
					<Text style={styles.headlineText}>{ decodeHTMLEntity(this.state.headline) }</Text>
					<Text style={styles.descriptionText}>{ decodeHTMLEntity(this.state.description) }</Text>
				</View>
			</View>
		);
	}
}

export default class TestPage extends Component {
	static navigationOptions = {
		title: '',
		headerTitle: <Image style={{height:40, resizeMode:'contain'}} source={require('./falconLogo.png')}/>,
		headerTintColor: '#A00000'
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
		buttonList = <ScrollView style={styles.scrollViewStyle} contentContainerStyle={{alignItems:'flex-start'}}>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/news', pageTitle:'NEWS'})}><Text style={styles.headlineText}>News</Text></TouchableOpacity>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/opinion', pageTitle:'OPINION'})}><Text style={styles.headlineText}>Opinion</Text></TouchableOpacity>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/features', pageTitle:'FEATURES'})}><Text style={styles.headlineText}>Features</Text></TouchableOpacity>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/sports', pageTitle:'SPORTS'})}><Text style={styles.headlineText}>Sports</Text></TouchableOpacity>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('Section', {storyLink: 'https://www.saratogafalcon.org/columns', pageTitle:'COLUMNS'})}><Text style={styles.headlineText}>Columns</Text></TouchableOpacity>
						<View style={{height: 5, backgroundColor: '#FFFFFF'}}></View>
						<TouchableOpacity onPress={() => navigate('About', {storyLink: 'https://www.saratogafalcon.org/about'})}><Text style={styles.headlineText}>About</Text></TouchableOpacity>
					</ScrollView>
		const {navigate} = this.props.navigation;
		if (!this.state.fetched) {
			return (
				<View style={styles.container}>
					<View style={styles.spotlightViewStyle}>
						<Button color='#010101' title="Loading..."></Button>
					</View>
					<View style={{height: 1, backgroundColor: '#A3A1A1'}}></View>
					{ buttonList }
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
					{ buttonList }
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
	scrollViewStyle: {
		flex: 1,
		width: '100%'
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
		marginTop: 2,
		marginBottom: 2,
		marginLeft: 5,
		marginRight: 5
	},
	buttonStyle: {
		fontSize: 2,
		height: 25
	},
	descriptionText: {
		flex: 0,
		includeFontPadding: false,
		textAlignVertical: "bottom",
		fontSize: 16, 
		color: '#120000', 
		margin: 5
	}
})