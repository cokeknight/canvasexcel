import Vue from 'vue'
import Demo from './components/demo'
export const Heade = {
  functional: true,
  name: "child-head",
  render (h,context){
    return <li>{context.props.name}{context.props.span}</li>
  }
}
export const Article = {
  name: "child-head",
  props:['name','span'],
  render (){
    console.log('Article 最后',this,this.$attrs.columns)
    return <li>{this.name}{this.span}{this.$attrs.columns}</li>
  }
}
// const ArticleConstruction = Vue.extend(Article)
// console.log('ArticleConstruction',ArticleConstruction)
  // ArticleConstruction.constructor.options =  {data:{attrs:{
  //   columns:"xxxxxx"}}}
 const Article2 = new Vue({
      el: document.createElement('div'),
      render(){    
        return <Article columns="xxxxxx" name="333"/>
      }
  })
  // _parentVnode:{
  //   data:{ attrs:{
  //     columns:"xxxxxx"}
  //   }
  // }
// })
console.log('ArticleConstruction2',Article2)
// Article2.
export const Header = {
  functional: true,
  name: "Header",
  render (h,context){
    // const a =  <Heade name="sasas"/>
    // debugger
    // return a
    const HeaderList = <ul>{
      context.children.map((child,index)=>{
        // let props = node.componentOptions.propsData
        // child.context.$props = {name:3}
        //  console.log(14,child,child.tag() )
        // const $vnode = child.tag()
        // // 挂载
        // mount($vnode, container, isSVG)
        // // el 元素引用该组件的根元素
        // child.el = $vnode.el

         const ctor = h(child.fnOptions,{props:{name:3}})
         console.log(child.fnOptions)
        //  ctor.options = {render: Heade.render,props:{name:3}}
        //  ctor.componentOptions.propsData={name:3}
          return ctor
      })
    }
    </ul>
    return <div>{HeaderList}</div>
  }
}

export default {
  name: 'app',
  data(){
    const table = {tableData:3}
    // for(let i=0;i<1000;i++){
    //   table['tableData'+i] = i
    // }
    return {
      rulfom:{
        x:1,
        // y:null
      },
      table
    }
  },
  // mounted(){
  //   setTimeout(()=>{
  //     // this.$forceUpdate()
  //   },0)
  // },

  watch:{
    'rulfom':{
      deep:true,
      handler(){
        console.log('som')
      }
      
    }
  },
  methods:{
    handler(){
      // const table = {tableData:4}
      // for(let i=0;i<1000;i++){
      //   table['tableData'+i] = i
      // }
      // this.table.tableData = 4
      this.rulfom.y= 333
      // Object.assign(this.rulfom,{y:333})
      // this.$refs.table.update({
      //   x:4
      // })
      // this.$forceUpdate()
    },
    getArticle(){
      return <Article name="2121" span="span" cloumns="xxxxx"/>
    }
  },
  mounted(){

console.log('Article3',Article2)
this.$forceUpdate()
setTimeout(()=>{
  document.body.append(Article2.$el)
})

  },
  render(){
    // const article= this.getArticle()

    return <div><Header name="big">
      <Heade span={5}/>21212</Header>
      <input vModel={this.rulfom.x}/>
      <button onclick={this.handler}>按钮{this.rulfom.x}{this.rulfom.y}</button>
      {/* {article} */}
      <Demo ref="table" table={this.table}/>
    </div>
  }
}
