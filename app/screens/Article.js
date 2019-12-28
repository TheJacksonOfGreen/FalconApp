import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';
import {
	StyleSheet, 
	Text, 
	Image, 
	ScrollView, 
	View
} from 'react-native';

export default class ArticlePage extends Component {
	constructor (props) {
		super(props)
		this.state = {headline:"", byline:"", story:"", imageLink:"", caption:"", fetched:false, storyLink:""}
	}
	componentDidMount () {
		const { navigation } = this.props;
		this.state.storyLink = navigation.getParam('storyLink', '')
		fetch(this.state.storyLink)
		.then((response) => response.text())
		.then((responseText) => {
			var root = HTMLParser.parse(responseText)
			// For ID use pound symbol
			// For Class use dot
			var paragraphList = root.querySelector('.story_body').childNodes
			console.log(paragraphList)
			var storyParagraphs = []
			for (var i = 0; i < paragraphList.length; i++) {
				storyParagraphs.push(paragraphList[i].rawText)
			}
			var fullStory = "\t"
			for (var i = 0; i < storyParagraphs.length; i++) {
				fullStory = fullStory.concat(storyParagraphs[i], "\t")
			}
			var linkToImage = ''
			var theCaption = ''
			try {
				linkToImage = root.querySelector('.falcon_photo_halfsize').firstChild.attributes['src']
				theCaption = root.querySelector('.photo_caption').text
			} catch {}
			this.setState(previousState => ({
				headline:root.querySelector('#page-title').text.trim(), 
				byline:root.querySelector('.author_info').text, 
				imageLink:linkToImage,
				caption:theCaption,
				story:fullStory,
				fetched:true
			}))
			console.log(this.state.imageLink)
		})
		.catch((error) => {
		  console.error(error);
		});
	}
	render () {
		var picture = ''
		if (this.state.imageLink != '') {
			picture = <View style={styles.extraImageStyleThing}><Image style={styles.imageStyle} source={{uri: this.state.imageLink}} /><Text style={styles.caption}>{ this.state.caption }</Text></View>
		} else {
			picture = <View style={styles.extraImageStyleThing}></View>
		}
		if (!this.state.fetched) {
			return (
				<View style={styles.container}>
					<Text style={styles.title1}>
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
					<ScrollView>
						<Text style={styles.title1}>
							{ this.state.headline }
						</Text>
						<Text style={styles.title2}>
							{ this.state.byline }
						</Text>
						{ picture }
						<Text style={styles.title3}>
							{ this.state.story }
						</Text>
					</ScrollView>
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
	extraImageStyleThing: {
		paddingVertical: 0,
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF'
	}, 
	stationaryImageView: {
		paddingVertical: 45,
		paddingBottom: 25, 
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'flex-start',
		backgroundColor: '#FFFFFF'
	},
	title1: {
		fontSize: 40, 
		textAlign: 'auto',
		color: '#000000', 
		margin: 10
	},
	title2: {
		fontSize: 20, 
		textAlign: 'auto',
		color: '#A00000', 
		margin: 10
	},
	title3: {
		fontSize: 18, 
		textAlign: 'auto',
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