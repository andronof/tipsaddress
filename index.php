<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8" />
      <title>Подсказки адреса</title>
      <link rel="stylesheet" href="./css/normalize.css">
      <link rel="stylesheet" href="./css/main.css">
   </head>
   <body>
        <form id="components-input-address" v-on:submit.prevent="">
            <input-address minchar="3" maxhelp="6"></input-address>
        </form>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <script src="https://unpkg.com/axios@0.18.0/dist/axios.min.js"></script>
        <script src="./js/main.js"></script>
   </body>
</html>