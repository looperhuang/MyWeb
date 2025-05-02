import { boot } from 'quasar/wrappers';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 如果你只想按需引入，也可只 import 少量 component + theme-chalk
// import { ElButton, ElInput } from 'element-plus'
// import 'element-plus/theme-chalk/el-button.css'
// import 'element-plus/theme-chalk/el-input.css'

export default boot(({ app }) => {
  app.use(ElementPlus);
});
