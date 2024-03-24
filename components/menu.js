export const Menu = [
  {
    id: 1,
    label: "menuitems.dashboard.text",
    icon: "dashboardIcon",
    link: "/",
  },
  {
    id: 2,
    label: "menuitems.masterData.text",
    icon: "dataIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 3,
        icon: "productIcon",
        label: "menuitems.masterData.list.products",
        link: "/products",
      },
      {
        id: 4,
        icon: "customerIcon",
        label: "menuitems.masterData.list.customers",
        link: "/customers",
      },
      {
        id: 5,
        icon: "supplierIcon",
        label: "menuitems.masterData.list.suppliers",
        link: "/suppliers",
      },
      {
        id: 6,
        icon: "systemIcon",
        label: "menuitems.masterData.list.system",
        isMenuCollapsed: false,
        subItems: [
          {
            id: 7,
            icon: "circleIcon",
            label: "menuitems.masterData.list.onPromise",
            link: "/system/on-premise",
          },
          {
            id: 8,
            icon: "circleIcon",
            label: "menuitems.masterData.list.cloud",
            link: "/system/cloud",
          },
          {
            id: 9,
            icon: "circleIcon",
            label: "menuitems.masterData.list.hosting",
            link: "/system/hosting",
          },
        ]
      },
    ]
  },

  {
    id: 10,
    label: "menuitems.sales.text",
    icon: "salesIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 11,
        icon: "circleIcon",
        label: "menuitems.sales.list.dashboard",
        link: "/sales-dashboard",
      },
      {
        id: 11,
        icon: "circleIcon",
        label: "menuitems.sales.list.leads",
        link: "/leads",
      },
      {
        id: 12,
        icon: "circleIcon",
        label: "menuitems.sales.list.contactReports",
        link: "/contact-reports",
      },
      {
        id: 13,
        icon: "circleIcon",
        label: "menuitems.sales.list.surveys",
        link: "/surveys",
      },
      {
        id: 14,
        icon: "circleIcon",
        label: "menuitems.sales.list.offers",
        link: "/offers",
      },
      {
        id: 15,
        icon: "circleIcon",
        label: "menuitems.sales.list.orderConfirmation",
        link: "/order-confirmation",
      },
    ]
  },

  {
    id: 16,
    label: "menuitems.finance.text",
    icon: "financeIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 17,
        label: "menuitems.finance.list.dashboard",
        icon: "dashboardIcon",
        link: "/finance/dashboard",
      },
      {
        id: 18,
        label: "menuitems.finance.list.invoices",
        icon: "circleIcon",
        link: "/finance/invoices",
      },
      {
        id: 19,
        label: "menuitems.finance.list.timeChecking",
        icon: "circleIcon",
        link: "/finance/time-checking",
      },
      {
        id: 19,
        label: "menuitems.finance.list.performanceRecords",
        icon: "circleIcon",
        link: "/finance/performance-records",
      },
      {
        id: 20,
        label: "menuitems.finance.list.openPosts",
        icon: "circleIcon",
        link: "/finance/open-posts",
      },
    ]
  },
  {
    id: 21,
    label: "menuitems.consulting.text",
    icon: "consultingIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 22,
        label: "menuitems.consulting.list.dashboard",
        icon: "dashboardIcon",
        link: "/",
      },
      {
        id: 23,
        label: "menuitems.consulting.list.workshopTemplates",
        icon: "circleIcon",
        link: "/consulting/workshop-templates",
      },
      {
        id: 24,
        label: "menuitems.consulting.list.handouts",
        icon: "circleIcon",
        link: "/consulting/handouts",
      },
    ]
  },
  {
    id: 25,
    label: "menuitems.projectManagement.text",
    icon: "projectManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 21,
        icon: "circleIcon",
        label: "menuitems.projectManagement.list.projects",
        link: "/project-management/projects",
      },
      {
        id: 22,
        icon: "circleIcon",
        label: "menuitems.projectManagement.list.project-protocols",
        link: "/project-management/project-protocols",
      },
    ]
  },
  {
    id: 23,
    label: "menuitems.support.text",
    icon: "supportIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 24,
        icon: "circleIcon",
        label: "menuitems.support.list.tickets",
        link: "/support/tickets",
      },
      {
        id: 25,
        icon: "circleIcon",
        label: "menuitems.support.list.ams",
        link: "/support/ams",
      },
    ]
  },

  {
    id: 23,
    label: "menuitems.assetManagement.text",
    icon: "supportIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 24,
        icon: "circleIcon",
        label: "menuitems.assetManagement.list.assets",
        link: "/asset-management/assets",
      },
      {
        id: 25,
        icon: "circleIcon",
        label: "menuitems.assetManagement.list.assetsEmployeeList",
        link: "/asset-management/asset-employee-list",
      },
    ]
  },


  {
    id: 26,
    label: "menuitems.personalManagement.text",
    icon: "personalManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 27,
        icon: "circleIcon",
        label: "menuitems.personalManagement.list.employees",
        link: "/personal-management/employees",
      },
      {
        id: 27,
        icon: "circleIcon",
        label: "menuitems.personalManagement.list.job",
        link: "/personal-management/job",
      },
      {
        id: 28,
        icon: "circleIcon",
        label: "menuitems.personalManagement.list.departments",
        link: "/personal-management/departments",
      },
      {
        id: 29,
        icon: "circleIcon",
        label: "menuitems.personalManagement.list.locations",
        link: "/personal-management/locations",
      },
      {
        id: 30,
        icon: "circleIcon",
        label: "menuitems.personalManagement.list.teams",
        link: "/personal-management/teams",
      },
    ]
  },
  {
    id: 31,
    label: "menuitems.contractManagement.text",
    icon: "fleetManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 32,
        icon: "circleIcon",
        label: "menuitems.contractManagement.list.inboundedContracts",
        link: "/contract-management/inbounded-contracts",
      },
      {
        id: 32,
        icon: "circleIcon",
        label: "menuitems.contractManagement.list.outboundedContracts",
        link: "/contract-management/outbounded-contracts",
      },
    ]
  },
  ////////////////////
  {
    id: 31,
    label: "menuitems.licenses.text",
    icon: "fleetManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 32,
        icon: "circleIcon",
        label: "menuitems.licenses.list.licenseGen",
        link: "/licenses",
      },
    ]
  },
  {
    id: 33,
    label: "menuitems.fleetManagement.text",
    icon: "fleetManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 34,
        label: "menuitems.fleetManagement.list.fleetList",
        icon: "circleIcon",
        link: "/fleet-management/fleet-list",
      },
      {
        id: 35,
        label: "menuitems.fleetManagement.list.mileageMonitoring",
        icon: "circleIcon",
        link: "/fleet-management/mileage-monitoring",
      },
      {
        id: 36,
        label: "menuitems.fleetManagement.list.fuelMonitoring",
        icon: "circleIcon",
        link: "/fleet-management/fuel-monitoring",
      },
      {
        id: 37,
        label: "menuitems.fleetManagement.list.driverLicenceCheck",
        icon: "circleIcon",
        link: "/fleet-management/driver-licence-check",
      },
    ]
  },
  {
    id: 26,
    label: "menuitems.skillManagement.text",
    icon: "fleetManIcon",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 34,
        icon: "circleIcon",
        label: "menuitems.skillManagement.list.skills",
        link: "/skill-management/skill",
      },
      {
        id: 35,
        icon: "circleIcon",
        label: "menuitems.skillManagement.list.skillGroup",
        link: "/skill-management/skill-group",
      },
      {
        id: 35,
        icon: "circleIcon",
        label: "menuitems.skillManagement.list.skillMatrix",
        link: "/skill-management/skill-matrix",
      },
    ]
  }
];
