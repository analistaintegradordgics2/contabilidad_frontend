// Rutas para el modulo de contabilidad.
const routes = [
  // Ruta para el plan unico de cuentas
  {
    path: '/contabilidad/plan_cuentas',
    name: 'plandecuentas',
    component: () => import('pages/contabilidad/captura_datos/plancuentas/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Plan único de cuentas', to: { name: '' } }
      ]
    }
  },
  {
    path: '/contabilidad/plan_cuentas/crear',
    name: 'crearplandecuentas',
    component: () => import('pages/contabilidad/captura_datos/plancuentas/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Captura de datos', to: { name: '' } },
        { label: 'Plan único de cuentas', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para los conceptos
  {
    path: '/contabilidad/conceptos',
    name: 'conceptos',
    component: () => import('pages/contabilidad/captura_datos/conceptos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Conceptos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/conceptos/crear',
    name: 'crearconceptos',
    component: () => import('pages/contabilidad/captura_datos/conceptos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Conceptos', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para los tipo de documentos
  {
    path: '/contabilidad/tipodocumentos',
    name: 'tipodocumentos',
    component: () => import('pages/contabilidad/captura_datos/tipodocumentos/index.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Tipo de documentos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/tipodocumentos/crear',
    name: 'creartipodocumentos',
    component: () => import('pages/contabilidad/captura_datos/tipodocumentos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Tipo de documentos', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para los centros de costos
  {
    path: '/contabilidad/centros_costos',
    name: 'centroscostos',
    component: () => import('pages/contabilidad/captura_datos/centro_costos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Centro de costos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/centros_costos/crear',
    name: 'crearcentroscostos',
    component: () => import('pages/contabilidad/captura_datos/centro_costos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Captura de datos', to: { name: '' } },
        { label: 'Centro de costos', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para los bancos
  {
    path: '/contabilidad/bancos',
    name: 'bancos',
    component: () => import('pages/contabilidad/captura_datos/bancos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Bancos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/bancos/crear',
    name: 'crearbancos',
    component: () => import('pages/contabilidad/captura_datos/bancos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Captura de datos', to: { name: '' } },
        { label: 'Bancos', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para las cuentas bancarias
  {
    path: '/contabilidad/cuentas_bancarias',
    name: 'cuentas_bancarias',
    component: () => import('pages/contabilidad/captura_datos/cuentas_bancarias/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Captura de datos', to: { name: '' } },
        { label: 'Directorio Contable', to: { name: '' } },
        { label: 'Cuentas bancarias', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/cuentas_bancarias/crear',
    name: 'crearcuentas_bancarias',
    component: () => import('pages/contabilidad/captura_datos/cuentas_bancarias/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Captura de datos', to: { name: '' } },
        { label: 'Cuentas bancarias', to: { name: '' } },
        { label: 'Crear', to: null }
      ]
    }
  },

  // Ruta para los documentos
  {
    path: '/contabilidad/procesos/documentos',
    name: 'documentos',
    component: () => import('pages/contabilidad/procesos/documentos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Gastos Administrativos', to: { name: '' } },
        { label: 'Generación de Documentos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/procesos/documentos/crear/:tipodocumento',
    name: 'creardocumentos',
    component: () => import('pages/contabilidad/procesos/documentos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Documento', to: { name: '' } },
        { label: 'Crear', to: null }
      ],
      validar_salida: true
    }
  },
  {
    path: '/contabilidad/procesos/documento/:documento, :tipodocumento, :id_doc',
    name: 'verdocumento',
    component: () => import('pages/contabilidad/procesos/documentos/partial/crear.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Documento', to: { name: '' } },
      ],
      validar_salida: true
    }
  },
  // Fin Ruta para los documentos

  // Ruta para informe diario de caja
  {
    path: '/contabilidad/procesos/informe-diario-caja',
    name: 'infdiariocaja',
    component: () => import('pages/contabilidad/procesos/infdiariocaja/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Informes', to: { name: '' } },
        { label: 'Informe diario de caja', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/procesos/contabilizacion-por-planos',
    name: 'conta_por_plano',
    component: () => import('pages/contabilidad/procesos/conta_planos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Contabilizacion por planos', to: { name: '' } },
      ]
    }
  },
  // fin Ruta para informe diario de caja

  // Ruta para informe diario de caja
  {
    path: '/contabilidad/procesos/conciliacion_bancararia',
    name: 'conciliacion_bancararia',
    component: () => import('pages/contabilidad/procesos/conciliacion_bancaria/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Conciliación bancaria', to: { name: '' } },
      ]
    }
  },
  // fin Ruta para informe diario de caja

  // Ruta para consultas
  {
    path: '/contabilidad/consultas/auxiliar-codigo-nit',
    name: 'auxcodigonit',
    component: () => import('pages/contabilidad/consultas/auxiliarcodigonit/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Auxiliar por código y nit', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/auxiliar-bancos',
    name: 'auxbancos',
    component: () => import('pages/contabilidad/consultas/auxiliarbancos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Auxiliar por bancos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/balance-general',
    name: 'balancegeneral',
    component: () => import('pages/contabilidad/consultas/balancegeneral/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Consultas', to: { name: '' } },
        { label: 'Informes', to: { name: '' } },
        { label: 'Balance general', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/balance-prueba',
    name: 'balanceprueba',
    component: () => import('pages/contabilidad/consultas/balanceprueba/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Consultas', to: { name: '' } },
        { label: 'Informes', to: { name: '' } },
        { label: 'Balance de prueba', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/estado-de-resultados',
    name: 'estadoresultados',
    component: () => import('pages/contabilidad/consultas/estadoresultados/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Estado de prueba', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/comprobante-diario',
    name: 'comprobantediario',
    component: () => import('pages/contabilidad/consultas/comprobantediario/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Consultas', to: { name: '' } },
        { label: 'Informes', to: { name: '' } },
        { label: 'Comprobante diario', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/informes-comparativos',
    name: 'infcomparativos',
    component: () => import('pages/contabilidad/consultas/infcomparativos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Consultas', to: { name: '' } },
        { label: 'Informes', to: { name: '' } },
        { label: 'Informes comparativos', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/auditorias',
    name: 'auxauditoria',
    component: () => import('pages/contabilidad/consultas/auditoria/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        // { label: 'Consultas', to: { name: '' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Auditoría', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/informe-de-cartera',
    name: 'infcartera',
    component: () => import('pages/contabilidad/consultas/informecartera/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Informe de cartera', to: { name: '' } },
      ]
    }
  },
  {
    path: '/contabilidad/consultas/informe-diario-dian',
    name: 'infcarteradian',
    component: () => import('pages/contabilidad/consultas/informediariodian/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Informe de cartera', to: { name: '' } },
      ]
    }
  },
  // Fin Ruta para consultas
  // Ruta para certificados de propietario y arrendatarios
  {
    path: '/contabilidad/consultas/certificados',
    name: 'certificados',
    component: () => import('pages/contabilidad/consultas/certificados/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Consultas', to: { name: '' } },
        { label: 'Certificados', to: { name: '' } },
      ]
    }
  },
  // Fin Ruta para certificados de propietario y arrendatarios
  // Ruta para cierres
  {
    path: '/contabilidad/cierres',
    name: 'contabilidad_cierres',
    component: () => import('pages/contabilidad/cierres/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Cierres', to: { name: '' } },
        // { label: 'Proceso de cierres', to: { name: '' } },
      ]
    }
  },
  // Fin Ruta para cierres
  // Ruta para cierres
  {
    path: '/contabilidad/reconstrucción de movimientos',
    name: 'contabilidad_reconstruccion',
    component: () => import('pages/contabilidad/reconstruccion/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Gestión Contable', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Reconstrucción de Movimientos', to: { name: '' } },
      ]
    }
  },
  // Fin Ruta para cierres
  // Ruta para cierres
  {
    path: '/contabilidad/procesos/cambio_de_fechas',
    name: 'contabilidad_cabio_fechas',
    component: () => import('pages/contabilidad/procesos/cambio_fechas/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Cambio de fecha', to: { name: '' } },
      ]
    }
  },
  // Fin Ruta para cierres
  // Ruta para cargos fijos
  {
    path: '/contabilidad/cargos_fijos',
    name: 'contabilidad_cargos_fijos',
    component: () => import('pages/contabilidad/cargos_fijos/index.vue'),
    meta: {
      breadcrumbs: [
        // { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'Procesos', to: { name: '' } },
        { label: 'Cargos Fijos', to: { name: '' } }
      ]
    }
  },
  // Fin Ruta para cargos fijos
  // Ruta para Exogena
  {
    path: '/contabilidad/exogena',
    name: 'exogena',
    component: () => import('pages/contabilidad/exogena/index.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'Exogena', to: { name: '' } }
      ]
    }
  },
  // Fin Ruta para Exogena
  // Ruta para cargos masivos
  {
    path: '/contabilidad/cargos-masivos',
    name: 'cargos_masivos',
    component: () => import('pages/contabilidad/cargos_masivos/index.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'Cargos Masivos', to: { name: '' } }
      ]
    }
  },
  // Fin Ruta para cargos masivos
  // Ruta para medios distritales
  {
    path: '/contabilidad/medios_distritales',
    name: 'medios_distritales',
    component: () => import('pages/contabilidad/medios_distritales/index.vue'),
    meta: {
      breadcrumbs: [
        { label: 'Contabilidad', to: { name: 'home' } },
        { label: 'medios distritales', to: { name: '' } }
      ]
    }
  },
  // Fin Ruta para medios distritales
  // Cierres especiales
  {
    path: '/contabilidad/procesos/cierres_especiales',
    name: 'cirres_especiales',
    component: () => import('pages/contabilidad/procesos/cierre_especial/index.vue'),
    meta: {
      breadcrumbs: [
        {label: 'Contabilidad',to: {name: 'home'}},
        {label: 'Procesos', to: {name: ''}},
        {label: 'Cierre especial', to: {name: ''}},
      ]
    }
  },
  // Fin Cierres especiales
]
export default routes
