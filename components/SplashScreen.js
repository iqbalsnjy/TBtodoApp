import React, { Component } from 'react'
import { Text, View } from 'react-native'
import colors from '../Colors'

export default class SplashScreen extends React.Component {
            render() {
              const viewStyles = [
                styles.container,
                { backgroundColor: colors.white }
              ];
              const textStyles = {
                color: colors.black,
                fontSize: 40,
                fontWeight: 'bold'
              };
          
              return (
                <View style={viewStyles}>
                  <Text style={textStyles}>
                    Welcome Todo List
                  </Text>
                </View>
              );
            }
          }
