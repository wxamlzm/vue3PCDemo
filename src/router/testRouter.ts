import type { RouteRecordRaw } from "vue-router";

export const testRoutes: RouteRecordRaw[] = [
  {
    path: "healthSupervisionEvaluationManage",
    meta: {
      title: "职业卫生监督与评价管理",
    },
    children: [
      {
        path: "/healthSupervisitionEvaluationManage/internal/reviewer",
        name: "HealthSupervisionEvaluationManageContractor",
        meta: { title: "内部监督检查与评价" }, // 保健物理处角色
        component:()=> import()
      },
      {
        path: "/healthSupervisitionEvaluationManage/internal/constractor",
        name: "HealthSupervisionEvaluationManageContractor",
        meta: { title: "内部监督检查与评价" }, // 保健物理处角色
        component:()=> import()
      },
    ],
  },
];
