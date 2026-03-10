<template>
  <q-page class="q-ma-lg q-ml-lg">
    <q-card flat>
    
      <q-form class="row q-col-gutter-md" ref="formconsulta">
        <div class="col-10 flex items-center ">
          <div>
            <l-select
            col="md-2 text-black"
            v-model="formato"
            option-value="id"
            option-label="nombre"
            label="Formato :"
            :options="optionsFormat"
            :rules="[$rules.required($t('validator.required'))]"
          />
          </div>
          <div>
            <l-select
            col="md-2 text-black"
            v-model="model.anio"
            option-value="nombre"
            option-label="nombre"
            label="Año *"
            class="q-field--float"
            :options="anio"
            :rules="[$rules.required($t('validator.required'))]"
          />
          </div>
          <div>
            <q-btn
              unelevated
              dense
              round
              color="primary"
              icon="search"
              @click="cargar(formato)"
            >
              <q-tooltip>Buscar</q-tooltip>
            </q-btn>
          </div>
          <div class="col-6 flex items-center justify-end">
          </div>
        </div>
        <div class="col-2 flex justify-end">
          <q-chip class="botones_acciones listbtnacciones  q-ma-none" size="22px">
              <div class="row">
              <q-btn round dense unelevated color="white" text-color="red" class="btnAcciones"
                v-if="showBtnInconsistencias" @click="abrirModal"
              > 
                <q-icon name="info" style="color: #42a5f5"/>
                <q-tooltip>Inconsistencias</q-tooltip>
              </q-btn>
              <q-btn
                round
                dense
                unelevated
                class="btnAcciones q-ml-sm"
                color="white"
                @click="handleButtonClicked"
              >
                <q-icon name="mdi-microsoft-excel" style="color: #42a5f5"/>
                <q-tooltip>Exportar excel</q-tooltip>
              </q-btn>

            </div>
          </q-chip>
        </div>
      </q-form>
      <div class="row">
        <div class="col-12">
            <formato1001 ref="formato1001" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1001"/>
            <formato1003 ref="formato1003" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1003"/>
            <formato1005 ref="formato1005" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1005"/>
            <formato1006 ref="formato1006" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1006"/>
            <formato1007 ref="formato1007" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1007"/>
            <formato1008 ref="formato1008" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1008"/>
            <formato1009 ref="formato1009" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===1009"/>
            <formato5247 ref="formato5247" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5247"/>
            <formato5248 ref="formato5248" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5248"/>
            <formato5249 ref="formato5249" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5249"/>
            <formato5250 ref="formato5250" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5250"/>
            <formato5251 ref="formato5251" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5251"/>
            <formato5252 ref="formato5252" :columns="columns" :inAnio="model.anio.toString()" :onClick="clicky" v-if="formato===5252"/>
          </div>
      </div>
    </q-card>
    <modal ref="refinconsistencias" :value="inconsistencias" @reload="getLoadInconsistencias"/>
  </q-page>
</template>
<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import formato1001 from '../exogena/partial/formato1001.vue'
import formato1003 from '../exogena/partial/formato1003.vue'
import formato1005 from '../exogena/partial/formato1005.vue'
import formato1006 from '../exogena/partial/formato1006.vue'
import formato1007 from '../exogena/partial/formato1007.vue'
import formato1008 from '../exogena/partial/formato1008.vue'
import formato1009 from '../exogena/partial/formato1009.vue'
import formato5247 from '../exogena/partial/formato5247.vue'
import formato5248 from '../exogena/partial/formato5248.vue'
import formato5249 from '../exogena/partial/formato5249.vue'
import formato5250 from '../exogena/partial/formato5250.vue'
import formato5251 from '../exogena/partial/formato5251.vue'
import formato5252 from '../exogena/partial/formato5252.vue'
import modal from '../exogena/partial/inconsistencias/index.vue'

export default {
  layout: 'main',
  name: 'exogena',
  components: {
    formato1001,
    formato1003,
    formato1005,
    formato1006,
    formato1007,
    formato1008,
    formato1009,
    formato5247,
    formato5248,
    formato5249,
    formato5250,
    formato5251,
    formato5252,
    modal
  },
  data () {
    return {
      model: {
        anio: moment().format('YYYY')
      },
      datos: [],
      inconsistencias: [],
      formato: 1001,
      filter: '',
      clicky: false,
      data: [],
      showBtnInconsistencias: false,
      optionsFormat: [
        { id: 1001, nombre: 'formato 1001' },
        { id: 1003, nombre: 'formato 1003' },
        { id: 1005, nombre: 'formato 1005' },
        { id: 1006, nombre: 'formato 1006' },
        { id: 1007, nombre: 'formato 1007' },
        { id: 1008, nombre: 'formato 1008' },
        { id: 1009, nombre: 'formato 1009' },
        { id: 5247, nombre: 'formato 5247' },
        { id: 5248, nombre: 'formato 5248' },
        { id: 5249, nombre: 'formato 5249' },
        { id: 5250, nombre: 'formato 5250' },
        { id: 5251, nombre: 'formato 5251' },
        { id: 5252, nombre: 'formato 5252' }
      ],
      columns: [
        {
          name: 'tipo_contrato',
          label: 'Tipo Contrato',
          align: 'left',
          field: 'tipo_contrato',
          view: [2],
          form: [5247,5248, 5249, 5250, 5251, 5252]
        },
        {
          name: 'concepto_dian',
          label: 'Conc. DIAN',
          align: 'left',
          field: 'concepto_dian',
          view: [1, 2, 3, 4],
          form: [1001, 1003, 1007, 1008, 1009, 5247, 5248, 5251, 5252]
        },
        {
          name: 'tipo_doc',
          align: 'left',
          label: 'Tipo Doc.',
          field: 'tipo_doc',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'identidad',
          align: 'left',
          label: 'Identidad',
          field: 'identidad',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'dv',
          label: 'Digito V.',
          align: 'left',
          field: 'dv',
          view: [1, 2, 3, 4],
          form: [1003, 1005, 1006, 1007, 1008, 1009]
        },
        {
          name: 'p_apellido',
          align: 'left',
          label: 'Primer Apellido',
          field: 'p_apellido',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 's_apellido',
          align: 'left',
          label: 'Segundo Apellido',
          field: 's_apellido',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'p_nombre',
          align: 'left',
          label: 'Primer Nombre',
          field: 'p_nombre',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 's_nombre',
          align: 'left',
          label: 'Segundo Nombre',
          field: 's_nombre',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'razonsocial',
          align: 'left',
          label: 'Razón Social',
          field: 'razonsocial',
          view: [1, 2, 3],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009, 5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'iva',
          align: 'left',
          label: 'IVA',
          field: 'iva',
          view: [1, 2],
          form: [5250]
        },
        {
          name: 'direccion_res',
          align: 'left',
          label: 'Dirección',
          field: 'direccion_res',
          view: [1, 2, 3],
          form: [1001, 1003, 1008, 1009, 5247, 5251, 5252]
        },
        {
          name: 'ciudad',
          align: 'left',
          label: 'Ciudad',
          field: 'ciudad',
          view: [1],
          form: [1001, 1003, 1008, 1009, 5247, 5251, 5252]
        },
        {
          name: 'cod_dpto',
          align: 'left',
          label: 'Cod. Dpto',
          field: 'cod_dpto',
          view: [1, 2, 3],
          form: [1001, 1003, 1008, 1009, 5247, 5251, 5252]
        },
        {
          name: 'cod_mun',
          align: 'left',
          label: 'Cod. Mpio',
          field: 'cod_mun',
          view: [1, 2, 3],
          form: [1001, 1003, 1008, 1009, 5247, 5251, 5252]
        },
        {
          name: 'cod_pais',
          align: 'left',
          label: 'Cod. Pais',
          field: 'cod_pais',
          view: [1, 2, 3],
          form: [1001, 1007, 1008, 1009, 5247, 5248, 5251, 5252]
        },
        { name: 'saldo', 
          align: 'left', 
          label: 'Saldo', 
          field: 'saldo', 
          view: [1, 2, 3], 
          form: [1008, 1009, 5251, 5252] },
        {
          name: 'valor_pago',
          align: 'left',
          label: 'Valor Pago',
          field: 'valor_pago',
          view: [1, 2, 3],
          form: [5247, 5249]
        },
        { name: 'iva', 
          align: 'left', 
          label: 'Iva', 
          field: 'iva', 
          view: [1, 2, 3], 
          form: [1008, 1009, 5247,5249] },
        {
          name: 'retefuente',
          align: 'left',
          label: 'Retefuente',
          field: 'retefuente',
          view: [1, 2, 3],
          form: [1008, 1009, 5247]
        },
        {
          name: 'pago_deducible',
          align: 'left',
          label: 'Pago Deducible',
          field: 'pago_deducible',
          view: [1, 2, 3],
          form: [1001]
        },
        {
          name: 'pago_nodeducible',
          align: 'left',
          label: 'Pago No Deducible',
          field: 'pago_nodeducible',
          view: [1, 2, 3],
          form: [1001]
        },
        {
          name: 'iva_deducible',
          align: 'left',
          label: 'Iva Deducible',
          field: 'iva_deducible',
          view: [1, 2, 3],
          form: [1001]
        },
        {
          name: 'iva_nodeducible',
          align: 'left',
          label: 'Iva No Deducible',
          field: 'iva_nodeducible',
          view: [1, 2, 3],
          form: [1001]
        },
        {
          name: 'retefte_practicada',
          align: 'left',
          label: 'Rte Fte. Prácticada',
          field: 'retefte_practicada',
          view: [1, 2, 3],
          form: [1001]
        },
        {
          name: 'retefte_asumida',
          align: 'left',
          label: 'Rte Fte. Asumida',
          field: 'retefte_asumida',
          view: [1, 2, 3],
          form: [1001, 5247]
        },
        {
          name: 'retiva_regcomun',
          align: 'left',
          label: 'RteIVA Reg. Común',
          field: 'retiva_regcomun',
          view: [1, 2, 3],
          form: [1001, 5247]
        },
        {
          name: 'iva_recup',
          align: 'left',
          label: 'IVA Recuperado',
          field: 'iva_recup',
          view: [1, 2],
          form: [5250]
        },
        {
          name: 'reteiva_regsimple',
          align: 'left',
          label: 'RteIVA Reg. Simplificado',
          field: 'reteiva_regsimple',
          view: [1,2],
          form: [1001]
        },
        {
          name: 'reteiva_nodimici',
          align: 'left',
          label: 'RteIVA No Domiciliados',
          field: 'reteiva_nodimici',
          view: [2, 3],
          form: [1001, 5247]
        },
        {
          name: 'codigoL',
          align: 'left',
          label: 'Código',
          field: 'codigoL',
          view: [1, 4],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009]
        },
        {
          name: 'nombre_cuenta',
          align: 'left',
          label: 'Nombre Cuenta',
          field: 'nombre_cuenta',
          view: [1],
          form: [1001, 1003, 1005, 1006, 1007, 1008, 1009]
        },
        {
          name: 'p_apellido_tercero',
          align: 'left',
          label: 'Primer Apellido Mandante',
          field: 'p_apellido_tercero',
          view: [1],
          form: [5248, 5251, 5252, 5250]
        },
        {
          name: 's_apellido_tercero',
          align: 'left',
          label: 'Segundo Apellido Mandante',
          field: 's_apellido_tercero',
          view: [1],
          form: [5248, 5251, 5252, 5250]
        },
        {
          name: 'p_nombre_tercero',
          align: 'left',
          label: 'Primer Nombre Mandante',
          field: 'p_nombre_tercero',
          view: [1],
          form: [5248, 5251, 5252, 5250]
        },
        {
          name: 's_nombre_tercero',
          align: 'left',
          label: 'Segundo Nombre Mandante',
          field: 's_nombre_tercero',
          view: [1],
          form: [5248, 5251, 5252, 5250]
        },
        {
          name: 'nombre_tercero',
          align: 'left',
          label: 'Razón Social Mandante',
          field: 'nombre_tercero',
          view: [1],
          form: [5248, 5251, 5252, 5250]
        },
        {
          name: 'concepto',
          align: 'left',
          label: 'Concepto',
          field: 'concepto',
          view: [1],
          form: [1001, 1003, 1005, 1006, 5248]
        },
        {
          name: 'detalle',
          align: 'left',
          label: 'Detalle',
          field: 'detalle',
          view: [1, 4],
          form: [1001, 1003, 1005, 1006, 1007, 5248, 5249]
        },
        {
          name: 'valor_db',
          align: 'left',
          label: 'Débitos',
          field: 'valor_db',
          view: [1],
          form: [1001, 1003, 1005, 1006, 1007, 5249]
        },
        {
          name: 'valor_cr',
          align: 'left',
          label: 'Créditos',
          field: 'valor_cr',
          view: [1],
          form: [1001, 1003, 1005, 1006, 1007, 5249]
        },
        {
          name: 'fecha',
          align: 'left',
          label: 'Fecha',
          field: 'fecha',
          view: [1],
          form: [1001, 1003, 1005, 1006, 1007, 5249]
        },
        {
          name: 'numero',
          align: 'left',
          label: 'Documento',
          field: 'numero',
          view: [1],
          form: [1003, 1005, 1006, 1007, 5248, 5249]
        },
        { name: 'valor_base', 
          align: 'left', 
          label: 'Valor Base', 
          field: 'valor_base', 
          view: [2], 
          form: [1003] },
        {
          name: 'valor_retenido',
          align: 'left',
          label: 'Valor Retenido',
          field: 'valor_retenido',
          view: [2],
          form: [1003]
        },
        { name: 'iva_desc', 
          align: 'left', 
          label: 'Iva Desc', 
          field: 'iva_desc', 
          view: [1, 2], 
          form: [1005] },
        {
          name: 'valor_ingreso',
          align: 'left',
          label: 'Valor Ingreso',
          field: 'valor_ingreso',
          view: [1, 2],
          form: [5248]
        },
        { name: 'iva_gen', 
          align: 'left', 
          label: 'Iva Gen.', 
          field: 'iva_gen', 
          view: [1,2], 
          form: [1006] },
        { name: 'ing_propios', 
          align: 'left', 
          label: 'Ing. Propios', 
          field: 'ing_propios', 
          view: [1, 2], 
          form: [1007] },
        {
          name: 'devolucion',
          align: 'left',
          label: 'Devolución',
          field: 'devolucion',
          view: [1, 2],
          form: [1005, 1006, 1007, 5248]
        },
        { name: 'iva_mayor', 
          align: 'left', 
          label: 'Iva Mayor', 
          field: 'iva_mayor', 
          view: [1,2], 
          form: [1005] },      
        //{ name: 'impto_consumo', align: 'left', label: 'Impuesto Consumo', field: 'impto_consumo', view: [2], form: [1006] },
        { name: 'fidecomiso', 
          align: 'left', 
          label: 'Fidecomiso', 
          field: 'fidecomiso', 
          view: [2], 
          form: [5248] },
        {
          name: 'tipo_doc_mandante',
          align: 'left',
          label: 'Tipo Doc Mandante',
          field: 'tipo_doc_mandante',
          view: [1,2, 3],
          form: [5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'nit_mandante',
          align: 'left',
          label: 'NIT Mandante',
          field: 'nit_mandante',
          view: [1,2, 3],
          form: [5247, 5248, 5249, 5251, 5252, 5250]
        },
        {
          name: 'ing_consorcios',
          align: 'left',
          label: 'Ing. Consorcios',
          field: 'ing_consorcios',
          view: [1],
          form: [1007]
        },
        { name: 'ing_mandatos', 
          align: 'left', 
          label: 'Ing. Mandatos', 
          field: 'ing_mandatos', 
          view: [1], 
          form: [1007] },
        { name: 'ing_mineria', 
          align: 'left', 
          label: 'Ing. Mineria', 
          field: 'ing_mineria', 
          view: [1], 
          form: [1007] },
        {
          name: 'ing_fiduciaria',
          align: 'left',
          label: 'Ing. Fiduciaria',
          field: 'ing_fiduciaria',
          view: [1],
          form: [1007]
        },
        { name: 'ing_tercero', 
          align: 'left', 
          label: 'Ing. Tercero', 
          field: 'ing_tercero', 
          view: [1], 
          form: [1007] },
        {
          name: 'impto_consumo',
          align: 'left',
          label: 'Imp. Consumo',
          field: 'impto_consumo',
          view: [1, 2],
          form: [1006, 5250]
        },
      ]
    }
  },
  computed: {
    ...mapState('generales', ['anio'])
  },
  methods: {
    ...mapActions('generales', ['getConfAnio']),
    cargar(formato){
      const formatName =`formato${formato}`;
      const tab = eval(`this.$refs.${formatName}._data.tab`);
      eval(`this.$refs.${formatName}.armarColums(${tab})`);
    },
    handleButtonClicked () {
      this.clicky = !this.clicky
    },
    abrirModal () {
      this.$refs.refinconsistencias.openModal(this.inconsistencias)
    },
    async getLoadInconsistencias () {
      await this.Get('contabilidad/exogena/searchInconsistencias').then((resp) => {
        if (resp.length > 0) {
          this.inconsistencias = resp
          this.showBtnInconsistencias = true
        }
      })
    }
  },
  async created () {
    this.getConfAnio().then((resp) => {
      this.model.anio = this.anio.find((f) => f.nombre === parseInt(moment().format('YYYY'))).nombre
    })
    await this.getLoadInconsistencias()
  },
 


}
</script>
