import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';
import {
	StyleSheet, 
	Text, 
	Image, 
	ScrollView, 
	View
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
// Hyperlink doesn't export component name, don't do { this }
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationActions, StackActions } from 'react-navigation';

var decodeHTMLEntity = function(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};

var ampRM = function(str) {
	return str.replace(/&amp;/g, function(match, dec) {
		return "&";
	});
};

export default class ArticlePage extends Component {
	static navigationOptions = {
		title: '',
		headerTitle: <Image style={{height:40, resizeMode:'contain'}} source={require('./falconLogo.png')}/>,
		headerTintColor: '#A00000'
	};
	constructor (props) {
		super(props)
		this.state = {headline:"", byline:"", story:"", imageLink:"", caption:"", fetched:false, storyLink:"", ytLink:""}
	}
	componentDidMount () {
		const { navigation } = this.props;
		this.state.storyLink = 'https://www.saratogafalcon.org/about';
		fetch(this.state.storyLink)
		.then((response) => response.text())
		.then((responseText) => {
			var root = HTMLParser.parse(responseText);
			// For ID use pound symbol
			// For Class use dot
			if (root.querySelector('.node-type-falcon-shs-tv') != null) {
				this.setState(previousState => ({
					caption: 'ThisIsNotACaptionThisIsAnSHSTVLink',
					ytLink: root.querySelector('iframe').attributes['src']}
				));
			}
			var paragraphList = root.querySelector('.field-item').childNodes
			var storyParagraphs = []
			for (var i = 0; i < paragraphList.length; i++) {
				if ((paragraphList[i].rawText.substring(0, 8) == 'https://') || (paragraphList[i].rawText.substring(0, 7) == 'http://')) {
					storyParagraphs.push('\n' + paragraphList[i].firstChild.attributes['href']);
				} else {
					storyParagraphs.push(paragraphList[i].rawText);
				}
			}
			var fullStory = "\t";
			for (var i = 0; i < storyParagraphs.length; i++) {
				fullStory = fullStory.concat(storyParagraphs[i], "\t");
			}
			var linkToImage = '';
			var theCaption = '';
			try {
				linkToImage = root.querySelector('.falcon_photo_halfsize').firstChild.attributes['src'];
				theCaption = root.querySelector('.photo_caption').text;
			} catch {}
			if (this.state.caption == 'ThisIsNotACaptionThisIsAnSHSTVLink') {
				this.setState(previousState => ({
					headline:"none", 
					byline:"none", 
					fetched:true
				}))
			} else {
				this.setState(previousState => ({
					headline:"About", 
					byline:"none", 
					imageLink:linkToImage,
					caption:theCaption,
					story:fullStory,
					fetched:true
				}))
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}
	render () {
		const navigate = this.props.navigation;
		let resetAction = StackActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'SectionList' })
			],
		});
		var picture = '';
		if (this.state.imageLink != '') {
			picture = <View style={styles.imageContainmentStyle}><Image style={styles.imageStyle} source={{uri: this.state.imageLink}} /><Text style={styles.caption}>{ this.state.caption }</Text></View>
		} else if (this.state.caption == 'ThisIsNotACaptionThisIsAnSHSTVLink') {
			picture = <View style={styles.shstvStyle}><WebView mediaPlaybackRequiresUserAction = {true} source={{uri: this.state.ytLink}} /></View>
		} else {
			picture = <View style={styles.imageContainmentStyle}></View>
		}
		if (!this.state.fetched) {
			return (
				<View style={styles.container}>
					<Text style={styles.byline}>
						Loading...
					</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<View style={{height:50}}>
						<Text style={styles.pageTitleText}>ABOUT</Text>
					</View>
					<View style={{height: 1, width: '100%', backgroundColor: '#A3A1A1'}}></View>
					<ScrollView style={styles.scrollViewStyle}>
						<Hyperlink linkDefault={ false } 
							onPress={ (url, text) => {
								//Sends links that go to sections on Website to App Sections
								if (url.startsWith("https://www.saratogafalcon.org/")) {
									//Because Section is higher in stack than story, need to reset to top before navigating down
									if (url.endsWith('/news')) { 
										navigate.dispatch(resetAction);
										navigate.navigate('Section', {storyLink: 'https://www.saratogafalcon.org/news', pageTitle:'News'});
									} else if (url.endsWith('/sports')) {
										navigate.navigate('Section', {storyLink: 'https://www.saratogafalcon.org/sports', pageTitle:'Sports'});
									} else if (url.endsWith('/opinion')) {
										navigate.navigate('Section', {storyLink: 'https://www.saratogafalcon.org/opinion', pageTitle:'Opinion'});
									} else if (url.endsWith('/columns')) {
										navigate.navigate('Section', {storyLink: 'https://www.saratogafalcon.org/columns', pageTitle:'Columns'});
									} else if (url.endsWith('/features')) {
										navigate.navigate('Section', {storyLink: 'https://www.saratogafalcon.org/features', pageTitle:'Features'});
									} else {
										//Unknown Section Header, Default to standard browser
										Linking.openURL(url)
									}
								} else {
									//Link goes to external website, so just open it in browser.
									Linking.openURL(url)
								}}}
							linkStyle={ styles.linkText }
							linkText={ url => {
								if (url.substring(0,7) === 'mailto:') {
									return url.substring(7, url.length)
								} else if (url.length > 40) {
									return url.substring(0,40) + '...'} else {return url} 
								}
							}>
							<Text style={styles.bodyText}>
									{ ampRM(decodeHTMLEntity(this.state.story)) }
							</Text>
						</Hyperlink>
						<Hyperlink linkDefault={ true } linkText={ "Jackson Green" }> 
							<Text style={styles.bodyText}> App Created by https://www.youtube.com/watch?v=dQw4w9WgXcQ </Text>
							<Text style={styles.bodyText}>    </Text>
						</Hyperlink>
					</ScrollView>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start', 
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF'
	}, 
	imageContainmentStyle: {
		paddingVertical: 0,
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF'
	},
	scrollViewStyle: {
		flex: 1,
		width: '100%'
	}, 
	title1: {
		fontSize: 40, 
		textAlign: 'auto',
		color: '#000000', 
		margin: 10
	},
	byline: {
		fontSize: 20, 
		textAlign: 'auto',
		color: '#A00000', 
		margin: 10
	},
	bodyText: {
		fontSize: 18, 
		textAlign: 'auto',
		color: '#120000', 
		margin: 10
	},
	pageTitleText: {
		flex: 0,
		includeFontPadding: false,
		fontSize: 30, 
		textAlignVertical: "top",
		color: '#840000', 
		margin: 10
	},
	linkText: {
		fontSize: 18, 
		textAlign: 'auto',
		color: '#A00000', 
		margin: 10
	},
	shstvStyle: {
		flex: -1, 
		width: '100%',
		aspectRatio: 1.5,
		alignSelf: 'stretch'
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