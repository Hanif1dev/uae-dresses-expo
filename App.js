import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';

type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  fabric: 'stretch' | 'unstretch';
  sizes: string[];
  img: string;
};

// starter products
const INITIAL: Product[] = [
  { id:'1', name_ar:'عباية كلاسيكية', name_en:'Classic Abaya', price:349, fabric:'unstretch', sizes:['S','M','L','XL','2XL'], img:'https://placehold.co/600x800?text=Abaya' },
  { id:'2', name_ar:'فستان عصري',   name_en:'Modern Dress',  price:429, fabric:'stretch',   sizes:['S','M','L','XL'],       img:'https://placehold.co/600x800?text=Modern' },
  { id:'3', name_ar:'فستان سهرة',   name_en:'Evening Dress', price:999, fabric:'stretch',   sizes:['S','M','L'],            img:'https://placehold.co/600x800?text=Evening' },
];

export default function App(){
  const [lang, setLang] = useState<'ar'|'en'>('ar');
  const [q, setQ]     = useState('');
  const [tab, setTab] = useState<'shop'|'seller'|'bag'>('shop');

  const [products, setProducts] = useState<Product[]>(INITIAL);
  const [selected, setSelected] = useState<Product|null>(null);
  const [size, setSize] = useState<string>('M');
  const [bag, setBag] = useState<{id:string; name:string; price:number; size:string; img:string; qty:number;}[]>([]);

  // seller form fields
  const [f_name_ar, set_f_name_ar] = useState('');
  const [f_name_en, set_f_name_en] = useState('');
  const [f_price,   set_f_price]   = useState('');
  const [f_fabric,  set_fabric]    = useState<'stretch'|'unstretch'>('stretch');
  const [f_sizes,   set_f_sizes]   = useState('S,M,L');
  const [f_img,     set_f_img]     = useState('https://placehold.co/600x800?text=Dress');

  const t = (ar:string,en:string)=> lang==='ar'?ar:en;

  const filtered = useMemo(()=>{
    const needle = q.trim().toLowerCase();
    return products.filter(p => (lang==='ar'?p.name_ar:p.name_en).toLowerCase().includes(needle));
  },[q,lang,products]);

  const addToBag = ()=>{
    if(!selected) return;
    setBag(b=>[...b, { id:selected.id, name: lang==='ar'?selected.name_ar:selected.name_en, price:selected.price, size, img:selected.img, qty:1 }]);
    Alert.alert(t('تمت الإضافة','Added'), t('تمت إضافة المنتج إلى الحقيبة','Item added to bag'));
  };

  const clearForm = ()=>{
    set_f_name_ar(''); set_f_name_en(''); set_f_price(''); set_fabric('stretch'); set_f_sizes('S,M,L'); set_f_img('https://placehold.co/600x800?text=Dress');
  };

  const saveProduct = ()=>{
    const priceNum = Number(f_price);
    if(!f_name_ar || !f_name_en || !priceNum || !f_sizes){
      Alert.alert(t('الرجاء تعبئة البيانات','Please fill all fields (valid price).'));
      return;
    }
    const newItem: Product = {
      id: String(Date.now()),
      name_ar: f_name_ar.trim(),
      name_en: f_name_en.trim(),
      price: priceNum,
      fabric: f_fabric,
      sizes: f_sizes.split(',').map(s=>s.trim()).filter(Boolean),
      img: f_img.trim() || 'https://placehold.co/600x800?text=Dress'
    };
    setProducts(p=>[newItem, ...p]);
    setTab('shop');
    setSelected(newItem);
    setSize(newItem.sizes[0] || 'M');
    clearForm();
    Alert.alert(t('تم الحفظ','Saved'), t('تمت إضافة المنتج بنجاح','Product added successfully'));
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
      {/* Header */}
      <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderColor:'#eee' }}>
        <Text style={{ fontSize:20, fontWeight:'800' }}>{t('متجر الأناقة','Elegance Boutique')}</Text>
        <View style={{ flex:1 }} />
        <Pressable onPress={()=>setLang('ar')} style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:10, backgroundColor: lang==='ar'?'#111':'#eee', marginRight:6 }}>
          <Text style={{ color: lang==='ar'?'#fff':'#111' }}>AR</Text>
        </Pressable>
        <Pressable onPress={()=>setLang('en')} style={{ paddingHorizontal:10, paddingVertical:6, borderRadius:10, backgroundColor: lang==='en'?'#111':'#eee' }}>
          <Text style={{ color: lang==='en'?'#fff':'#111' }}>EN</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection:'row', gap:8, padding:12 }}>
        <Pressable onPress={()=>setTab('shop')}  style={{ paddingVertical:8, paddingHorizontal:14, borderRadius:14, backgroundColor: tab==='shop' ? '#111':'#eee' }}>
          <Text style={{ color: tab==='shop'?'#fff':'#111' }}>{t('التسوق','Shop')}</Text>
        </Pressable>
        <Pressable onPress={()=>setTab('bag')}   style={{ paddingVertical:8, paddingHorizontal:14, borderRadius:14, backgroundColor: tab==='bag' ? '#111':'#eee' }}>
          <Text style={{ color: tab==='bag'?'#fff':'#111' }}>{t('الحقيبة','Bag')}</Text>
        </Pressable>
        <Pressable onPress={()=>setTab('seller')} style={{ paddingVertical:8, paddingHorizontal:14, borderRadius:14, backgroundColor: tab==='seller' ? '#111':'#eee' }}>
          <Text style={{ color: tab==='seller'?'#fff':'#111' }}>{t('البائعة','Seller')}</Text>
        </Pressable>
      </View>

      {/* SHOP */}
      {tab==='shop' && (
        <ScrollView contentContainerStyle={{ padding:16, paddingTop:0 }}>
          <TextInput
            placeholder={t('ابحثي عن فستان...','Search for a dress...')}
            value={q} onChangeText={setQ}
            style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12 }}
          />

          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:12, marginTop:12 }}>
            {filtered.map(p => (
              <Pressable key={p.id} onPress={()=>{ setSelected(p); setSize(p.sizes[0]||'M'); }}
                style={{ width:'48%', backgroundColor:'#fafafa', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#eee' }}>
                <Image source={{ uri:p.img }} style={{ width:'100%', aspectRatio:3/4 }} />
                <View style={{ padding:8 }}>
                  <Text numberOfLines={1} style={{ fontWeight:'600' }}>{lang==='ar'?p.name_ar:p.name_en}</Text>
                  <Text style={{ opacity:0.7 }}>{p.price} {t('درهم','AED')}</Text>
                  <Text style={{ opacity:0.6, fontSize:12 }}>{p.fabric === 'stretch' ? t('مطاطي','Stretch') : t('غير مطاطي','Unstretch')}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Inline detail */}
          {selected && (
            <View style={{ marginTop:16, padding:12, borderWidth:1, borderColor:'#eee', borderRadius:16 }}>
              <Image source={{ uri:selected.img }} style={{ width:'100%', aspectRatio:3/4, borderRadius:12 }} />
              <Text style={{ fontSize:18, fontWeight:'800', marginTop:8 }}>{lang==='ar'?selected.name_ar:selected.name_en}</Text>
              <Text style={{ opacity:0.7 }}>{selected.price} {t('درهم','AED')}</Text>
              <Text style={{ opacity:0.7, marginTop:4 }}>{t('القماش','Fabric')}: {selected.fabric === 'stretch' ? t('مطاطي','Stretch') : t('غير مطاطي','Unstretch')}</Text>

              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:8 }}>
                {selected.sizes.map((s)=> (
                  <Pressable key={s} onPress={()=>setSize(s)} style={{ paddingHorizontal:12, paddingVertical:8, borderRadius:12, borderWidth:1, borderColor:'#ccc', backgroundColor: size===s?'#111':'#fff' }}>
                    <Text style={{ color:size===s?'#fff':'#111' }}>{s}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable onPress={addToBag} style={{ marginTop:12, padding:14, borderRadius:14, backgroundColor:'#111' }}>
                <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>{t('أضيفي إلى الحقيبة','Add to Bag')}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}

      {/* BAG */}
      {tab==='bag' && (
        <ScrollView contentContainerStyle={{ padding:16 }}>
          {bag.length===0 ? (
            <Text style={{ opacity:0.6 }}>{t('لا توجد عناصر في الحقيبة','Your bag is empty')}</Text>
          ) : bag.map((it, idx)=> (
            <View key={idx} style={{ flexDirection:'row', gap:10, marginTop:8, borderWidth:1, borderColor:'#eee', padding:8, borderRadius:12 }}>
              <Image source={{ uri:it.img }} style={{ width:60, height:80, borderRadius:8 }} />
              <View style={{ flex:1 }}>
                <Text style={{ fontWeight:'600' }}>{it.name}</Text>
                <Text style={{ opacity:0.7, fontSize:12 }}>{t('المقاس','Size')}: {it.size}</Text>
              </View>
              <Text style={{ alignSelf:'center' }}>{it.price} {t('درهم','AED')}</Text>
            </View>
          ))}
          {bag.length>0 && (
            <Text style={{ marginTop:12, fontWeight:'700' }}>
              {t('الإجمالي','Subtotal')}: {bag.reduce((s,i)=>s+i.price*i.qty,0)} {t('درهم','AED')}
            </Text>
          )}
        </ScrollView>
      )}

      {/* SELLER */}
      {tab==='seller' && (
        <ScrollView contentContainerStyle={{ padding:16 }}>
          <Text style={{ fontSize:18, fontWeight:'800', marginBottom:10 }}>{t('إضافة منتج','Add Product')}</Text>

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('الاسم (عربي)','Name (Arabic)')}</Text>
          <TextInput value={f_name_ar} onChangeText={set_f_name_ar} placeholder={t('عباية حرير','Silk Abaya')} style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12, marginBottom:8 }} />

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('الاسم (إنجليزي)','Name (English)')}</Text>
          <TextInput value={f_name_en} onChangeText={set_f_name_en} placeholder="Silk Abaya" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12, marginBottom:8 }} />

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('السعر بالدرهم','Price (AED)')}</Text>
          <TextInput keyboardType="numeric" value={f_price} onChangeText={set_f_price} placeholder="399" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12, marginBottom:8 }} />

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('القماش','Fabric')}</Text>
          <View style={{ flexDirection:'row', gap:8, marginBottom:8 }}>
            <Pressable onPress={()=>set_fabric('stretch')}   style={{ paddingVertical:8, paddingHorizontal:14, borderRadius:12, backgroundColor: f_fabric==='stretch'?'#111':'#eee' }}>
              <Text style={{ color: f_fabric==='stretch'?'#fff':'#111' }}>{t('مطاطي','Stretch')}</Text>
            </Pressable>
            <Pressable onPress={()=>set_fabric('unstretch')} style={{ paddingVertical:8, paddingHorizontal:14, borderRadius:12, backgroundColor: f_fabric==='unstretch'?'#111':'#eee' }}>
              <Text style={{ color: f_fabric==='unstretch'?'#fff':'#111' }}>{t('غير مطاطي','Unstretch')}</Text>
            </Pressable>
          </View>

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('المقاسات (مفصولة بفواصل)','Sizes (comma separated)')}</Text>
          <TextInput value={f_sizes} onChangeText={set_f_sizes} placeholder="S,M,L,XL" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12, marginBottom:8 }} />

          <Text style={{ opacity:0.6, marginBottom:4 }}>{t('رابط الصورة (اختياري)','Image URL (optional)')}</Text>
          <TextInput value={f_img} onChangeText={set_f_img} placeholder="https://..." style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:12, marginBottom:12 }} />

          <Pressable onPress={saveProduct} style={{ padding:14, borderRadius:14, backgroundColor:'#111' }}>
            <Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>{t('حفظ المنتج','Save Product')}</Text>
          </Pressable>

          <Text style={{ opacity:0.6, fontSize:12, marginTop:10 }}>
            {t('ملاحظة: تُحفظ المنتجات مؤقتاً داخل التطبيق (بدون حساب/سيرفر).','Note: Products are temporary (no server yet).')}
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
