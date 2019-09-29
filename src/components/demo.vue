<template>
    <div class="demo" @click="handle">DEMO {{type.x}}</div>
</template>
<script>

export default {
    data(){
        return {
            type: {
                x:1
            }
        }
    },
    props:['table'],
    watch:{
        type(){
            console.log(444)
        }
    },
    methods:{
        update(s){
            Object.assign(this.type, s)
        },
        handle(){
            debugger
            this.type = 4
        }
    }
}
</script>