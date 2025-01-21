const express = require("express");
const router = express.Router();

router.get("/menu/dashboard", (req, res) => {
  const menuData = {
    dashboard: {
      id: "group-dashboard",
      title: "dashboard",
      type: "group",
      icon: "dashboard",
      children: [
        {
          id: "dashboard",
          title: "dashboard",
          type: "collapse",
          icon: "dashboard",
          children: [
            {
              id: "default",
              title: "default",
              type: "item",
              url: "/dashboard/default",
              breadcrumbs: false,
            },
            {
              id: "analytics",
              title: "analytics",
              type: "item",
              url: "/dashboard/analytics",
              breadcrumbs: false,
            },
          ],
        },
        {
          id: "components",
          title: "components",
          type: "item",
          url: "/components-overview/buttons",
          icon: "components",
          target: true,
          chip: {
            label: "new",
            color: "primary",
            size: "small",
            variant: "combined",
          },
        },
      ],
    },
  };

  res.json(menuData);
});

// New /data/customers route to return 20 items
router.get("/customer/list", (req, res) => {
  const customers = Array.from({ length: 20 }, (_, i) => ({
    id: `customer-${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    country: `Country ${i + 1}`,
  }));

  res.json(customers);
});

module.exports = router;
