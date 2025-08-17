import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';

const PRODUCTS = [
  { id:'1', name_ar:'عباية كلاسيكية', name_en:'Classic Abaya', price:349, fabric:'unstretch', sizes:['S','M','L','XL','2XL'], img:'https://placehold.co/600x800?text=Abaya' },
  { id:'2', name_ar:'فستان عصري', name_en:'Modern Dress', price:429, fabric:'stretch', sizes:['S','M','L','XL'], img:'https://placehold.co/600x800?text=Modern' },
  { id:'3', name_ar:'فستان سهرة', name_en:'Evening Dress', price:999, fabric:'stretch', sizes:['S','M','L'], img:'https://placehold.co/600x800?text=Evening' }
];

export default function App(){
  const [lang, setLang] = useState<'ar'|'en'>('ar');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [size, setSize] = useState('M');
  const [cart, setCart] = useState<any[]>([]);
  const t = (ar:string,en:string)=> lang==='ar'?ar:en;

  const filtered = useMemo(()=> PRODUCTS.filter(p => (lang==='ar'?p.name_ar:p.name_en).includes(q)), [q,lang]);
  const addToCart = ()=>{ if(!selected) return; setCart(c=>[...c,{ id:selected.id, name: lang==='ar'?selected.name_ar:selected.name_en, price:selected.price, size, img:selected.img, qty:1 }]); };
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);

  return (
    <ScrollView style={{ backgroundColor:'#fff' }} contentContainerStyle={{ padding:16 }}>
      {/* Header */}
      <View style={{ flexDirection:'row', alignItems:'center' }}>
        <Text style={{ fontSize:20, fontWeight:'800' }}>{t('متجر الأناقة','Elegance Boutique')}</Text>
        <View style={{ flex:1 }} />
        <Pressable onPress={()=>setLang('ar')} style={{ paddingHorizontal:8, paddingVertical:6, borderRadius:10, backgroundColor: lang==='ar'?'#111':'#eee' }}><Text style={{ color: lang==='ar'?'#fff':'#111' }}>AR</Text></Pressable>
        <Pressable onPress={()=>setLang('en')} style={{ marginLeft:6, paddingHorizontal:8, paddingVertical:6, borderRadius:10, backgroundColor: lang==='en'?'#111':'#eee' }}><Text style={{ color: lang==='en'?'#fff':'#111' }}>EN</Text></Pressable>
      </View>

      {/* Search */}
      <View style={{ flexDirection:'row', gap:8, marginTop:12 }}>
        <TextInput placeholder={t('ابحثي عن فستان...','Search for a dress...')} value={q} onChangeText={setQ} style={{ flex:1, borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12 }} />
      </View>

      {/* Grid */}
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:12, marginTop:12 }}>
        {filtered.map(p => (
          <Pressable key={p.id} onPress={()=>{ setSelected(p); setSize(p.sizes[0]); }} style={{ width:'48%', backgroundColor:'#fafafa', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#eee' }}>
            <Image source={{ uri:p.img }} style={{ width:'100%', aspectRatio:3/4 }} />
            <View style={{ padding:8 }}>
              <Text numberOfLines={1} style={{ fontWeight:'600' }}>{lang==='ar'?p.name_ar:p.name_en}</Text>
              <Text style={{ opacity:0.7 }}>{p.price} {t('درهم','AED')}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Product modal (inline) */}
      {selected && (
        <View style={{ marginTop:16, padding:12, borderWidth:1, borderColor:'#eee', borderRadius:16 }}>
          <Image source={{ uri:selected.img }} style={{ width:'100%', aspectRatio:3/4, borderRadius:12 }} />
          <Text style={{ fontSize:18, fontWeight:'800', marginTop:8 }}>{lang==='ar'?selected.name_ar:selected.name_en}</Text>
          <Text style={{ opacity:0.7 }}>{selected.price} {t('درهم','AED')}</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:8 }}>
            {selected.sizes.map((s:string)=> (
              <Pressable key={s} onPress={()=>setSize(s)} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:12, borderWidth:1, borderColor:'#ccc', backgroundColor: size===s?'#111':'#fff' }}>
                <Text style={{ color:size===s?'#fff':'#111' }}>{s}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={addToCart} style={{ marginTop:12, padding:14, borderRadius:14, backgroundColor:'#111' }}>
            <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>{t('أضيفي إلى الحقيبة','Add to Bag')}</Text>
          </Pressable>
        </View>
      )}

      {/* Cart */}
      <View style={{ marginTop:24 }}>
        <Text style={{ fontSize:16, fontWeight:'800' }}>{t('الحقيبة','Bag')}</Text>
        {cart.map((it, idx)=> (
          <View key={idx} style={{ flexDirection:'row', gap:10, marginTop:8, borderWidth:1, borderColor:'#eee', padding:8, borderRadius:12 }}>
            <Image source={{ uri:it.img }} style={{ width:60, height:80, borderRadius:8 }} />
            <View style={{ flex:1 }}>
              <Text style={{ fontWeight:'600' }}>{it.name}</Text>
              <Text style={{ opacity:0.7, fontSize:12 }}>{t('المقاس','Size')}: {it.size}</Text>
            </View>
            <Text style={{ alignSelf:'center' }}>{it.price} {t('درهم','AED')}</Text>
          </View>
        ))}
        <Text style={{ marginTop:12, fontWeight:'700' }}>{t('الإجمالي','Subtotal')}: {subtotal} {t('درهم','AED')}</Text>
      </View>
    </ScrollView>
  );
}
