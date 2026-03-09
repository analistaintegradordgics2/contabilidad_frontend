<template>
  <div>
     <q-tabs
        v-model="tab"
        dense align="left" 
        narrow-indicator
        class="q-mt-sm"
      >
          <q-tab :name="1" label="Movimiento Detallado" @click="armarColums(1)"/>
          <q-tab :name="2" label="Formato 1003"  @click="armarColums(2)"/>
          <q-tab :name="3" label="Parámetros" @click="armarColums(3)"/>
      </q-tabs>
      <q-space class="espacio" />
    <q-tab-panels v-model="tab" animated class="bg-white text-primary">
       <q-tab-panel :name="1" class="q-pa-none">
          <tabMovimientos :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
      <q-tab-panel :name="2" class="q-pa-none">
          <tabFormato :columns="columnsData" :datos="datos"/>
       </q-tab-panel>
      <q-tab-panel :name="3" class="q-pa-none">
          <tabParametros :columns="columnsData" :datos="datos" :mayor="mayor" @update-detail="updateDetail" @delete-params="deleteParams" @add-params="onAddParams"/>
       </q-tab-panel>
    </q-tab-panels>
    </div>
</template>

<script>
import tabMovimientos from 'pages/contabilidad/exogena/partial/forms/tabMovimientos.vue'
import tabFormato from 'pages/contabilidad/exogena/partial/forms/tabFormato.vue'
import tabParametros from 'pages/contabilidad/exogena/partial/forms/tabParametros.vue'
import fileDownload from 'js-file-download'

export default {
  layout: 'main',
  name: 'formato1003',
  components: {
    tabMovimientos,
    tabFormato,
    tabParametros
  },
  props: {
    columns: {
      type: Array
    },
    inAnio: {
      type: String
    },
    onClick: {
      type: Boolean
    }
  },
  data () {
    return {
      tab: 1,
      columnsData: [],
      formato: 1003,
      mayor: [],
      datos: []
    }
  },
  computed: {},
  methods: {
    async getLoad (params) {
      await this.Get(`contabilidad/exogena/search/${1003}/${params}/${this.inAnio}`).then((resp) => {
        this.datos = resp ?? []
      })
    },
    async armarColums (params) {
      this.columnsData = this.columns.filter((x) => x.view.includes(params) && x.form.includes(this.formato))
      await this.getLoad(params)
      if (params === 3) await this.getMayor()
    },
    async getMayor () {
      try {
        this.mayor = await this.Get('contabilidad/mayor')
      } catch ({ message }) {
      }
    },
    onAddParams (param) {
      param.idformato = 3
      this.datos.push(param)
    },
    updateDetail (id, index) {
      this.datos.data[index].detalle = this.mayor.find((x) => x.id === id).codigo_nombre.split('-')[1]
    },
    async deleteParams (seleccionados) {
      await this.Post(`contabilidad/exogena/deleteParams`, {model: seleccionados}).then((response) => {
        if (response.status === 200) {
          seleccionados.forEach(element => {
            const index = this.datos.findIndex((x) => x.id === element)
            this.datos.splice(index,1)
          });
          this.LFinish(response.msg,() => {});
        }
      })
    }
  },
  watch: {
    'onClick' () {
      this.LConfim('¿Desea exportar en formato excel?', async () => await this.PostDownload('contabilidad/exogena/exportar_excel_exogena', { datos: this.datos, encabezado: `${this.tab === 1 ? 'Movimiento Detallado 1003' : this.tab === 2 ? 'Formato 1003' : 'Parametros 1003'}` }).then((resp) =>
        fileDownload(resp, `${this.tab === 1 ? 'MovimientoDetallado1003.xlsx' : this.tab === 2 ? 'Formato1003.xlsx' : 'Parametros1003.xlsx'}`))
      )
    }
  },
  mounted () {
    this.armarColums(1, this.formato)
  }
}
</script>
<style lang="scss">
.espacio {
  border-bottom: 1px solid;
  margin-bottom: 33px;
  border-color: #d8d8d8;
}
.q-tab__label {
  font-size: 16px;
}

.q-tab--active {
  & .q-tab__label {
    color: #194880;
    font-weight: bold;
  }
}
</style>