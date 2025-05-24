stargate-jungle/
├── frontend/                  # React + Vite + MUI
│   ├── public/
│   ├── src/
│   │   ├── api/               # Axios + socket clients
│   │   ├── assets/
│   │   │   └── images/        # Bilder och mediafiler
│   │   ├── components/        # UI-komponenter (Buttons, Tables etc.)
│   │   │   ├── apps/          # Appspecifika komponenter
│   │   │   ├── container/     # Sidobeskrivningar/meta
│   │   │   ├── custom-scroll/ # Scrollbars
│   │   │   ├── dashboards/    # Dashboard-widgets
│   │   │   ├── forms/         # Formulärkomponenter
│   │   │   ├── material-ui/   # MUI-wrappers
│   │   │   ├── pages/         # Page-komponenter
│   │   │   ├── shared/        # Globala komponenter
│   │   │   ├── tables/        # Tabellkomponenter
│   │   │   └── widgets/       # Små, återanvändbara komponenter
│   │   ├── context/           # AuthContext, SocketContext
│   │   ├── contextapi/        # Temats globala states
│   │   ├── features/          # Funktionsmoduler
│   │   │   ├── Auth/          # JWT-login, registrering
│   │   │   ├── FileManager/   # Uppladdning, visning, metadata
│   │   │   ├── IFCViewer/     # IFC.js rendering
│   │   │   ├── PDFAnnotator/  # PDF-annotering
│   │   │   ├── GanttChart/    # Frappe-gantt
│   │   │   ├── TimeTracker/   # Tidsloggning
│   │   │   ├── Chat/          # Socket.io realtidschatt
│   │   │   └── Filters/       # Dynamiska filter
│   │   ├── layouts/           # Dashboard + Auth-layouts
│   │   │   ├── blank/         # Enkel auth-layout
│   │   │   └── full/          # Full dashboard-layout
│   │   ├── routes/            # Skyddade och publika rutter
│   │   ├── theme/             # Anpassad MUI-tema
│   │   ├── types/             # TypeScript-typer
│   │   │   ├── apps/
│   │   │   ├── auth/
│   │   │   └── layout/
│   │   ├── utils/             # FormatDate, debounce, schema
│   │   │   └── languages/     # i18n språkhantering
│   │   ├── views/             # Kompletta sidor
│   │   │   ├── apps/
│   │   │   ├── authentication/
│   │   │   ├── charts/
│   │   │   ├── dashboards/
│   │   │   ├── forms/
│   │   │   ├── pages/
│   │   │   │   ├── landingpage/
│   │   │   │   └── frontend-pages/
│   │   │   ├── spinner/
│   │   │   ├── tables/
│   │   │   ├── ui-components/
│   │   │   └── widgets/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                   # Express + MongoDB (alt. PostgreSQL)
│   ├── controllers/           # Hanterar logik per entitet
│   ├── routes/                # REST-API-endpoints
│   ├── middleware/            # Auth, RBAC, rate-limit, error
│   ├── models/                # User, File, Task, ChatMessage
│   ├── services/              # TokenService, FileService etc
│   ├── sockets/               # Socket.io konfiguration
│   ├── database/              # DB-anslutning, seed, schema
│   ├── utils/                 # Logger, validatorer
│   └── index.ts               # Startfil
│
├── shared/                    # Gemensamma typer och konstanter
│   ├── types/
│   ├── config/                # Roller, rättigheter
│   └── utils/                 # Datumformat, validering
│
├── docs/                      # Markdown, systemdiagram
├── .env.example               # Mall för miljöinställningar
├── docker-compose.yml         # MongoDB, backend, frontend
└── README.md                  # Projektbeskrivning och instruktioner
