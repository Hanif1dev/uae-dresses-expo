import React from 'react';
import { SafeAreaView, View, Text, Pressable } from 'react-native';

export default function App(){
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:24}}>
        <Text style={{fontSize:22, fontWeight:'800', marginBottom:12}}>Elegance Boutique</Text>
        <Text style={{textAlign:'center', opacity:0.7, marginBottom:20}}>
          Baseline build — if you can open this screen, the APK is healthy.
        </Text>
        <Pressable style={{backgroundColor:'#111', paddingVertical:12, paddingHorizontal:20, borderRadius:12}}>
          <Text style={{color:'#fff', fontWeight:'700'}}>It Works 🎉</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
