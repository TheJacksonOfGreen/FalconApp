import React, { Component } from 'react';
import HTMLParser from 'fast-html-parser';
import { Image } from 'react-native';
import { WebView } from 'react-native-webview';

export default class ArticlePage extends Component {
	static navigationOptions = {
		title: '',
		headerTitle: <Image style={{height:40, resizeMode:'contain'}} source={require('./falconLogo.png')}/>,
		headerTintColor: '#A00000'
	};
	constructor (props) {
		super(props)
		this.state = {pageLink:"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
	}
	componentDidMount () {
		const { navigation } = this.props;
		this.state.pageLink = navigation.getParam('pageLink', '')
	}
	render () {
		return (
			<WebView source={{uri: this.state.pageLink}} style={{marginTop: 20}} />
		);
	}
}