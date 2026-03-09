<template>
  <div>
    <l-newmodal ref="modalpago" width="700px" :validar_salir="false" :persistent="true" @before-hide="cerrarModal()"
      footer titulo="Detalle de la Nota Contable">
      <template slot="body">
        <div class="q-pa-md">
          <q-form ref="formpago" class="row q-gutter-md">
            <l-input v-model="model.detalle" label='Detalle*' col="12" :rules="[$rules.required($t('validator.required'))]"/>            
          </q-form>
        </div>
      </template>
      <template slot="footer">
        <div class="row q-gutter-md justify-center">
          <div class="col-2">
            <q-btn dense rounded class="full-width icook" color="primary" type="buttom" @click="onSubmit">
              <label class="qbtn-label">Procesar</label>
            </q-btn>
          </div>
        </div>
      </template>
    </l-newmodal>
  </div>
</template>

<script>
import moment from "moment";
import fileDownload from "js-file-download";
import { mapState,mapActions } from "vuex";
export default {
  name: "modalpago",
  components: {

  },
  props: {
    value: {
      type: Array,
      defult: () => [],
    },
     seleccionar: {
      type: Array,
      defult: () => [],
    },
      in_search: {
      type: String,
      defult: () => "",
    },   
  },
  data() {
    return {
      model: {
        banco: null,
        tipo_generacion_documento: 1,
        persona: null,
        mes_pago: this.mes_pago,
        anio_pago: this.anio_pago,
        forma_pago: null,
        usuario: this.$store.getters["auth/user"].id,
        fecha: moment().format("DD/MM/YYYY"),
        detalle: null 
      },

    };
  },
  computed: {
  },
  methods: {
    async onSubmit() {
        this.LConfim('¿Está seguro/a? ¿Desea generar los documentos contables para los retroactivos diligenciados?', async () => {
        const search = ['', undefined, null].includes(this.in_search) ? 'all' : this.in_search.toUpperCase();
          await this.Post(`contabilidad/retroactivo_admon/${search}`, { detalle: this.model.detalle, seleccionados: this.seleccionar, excel: false, model:this.model }).then((resp) => {
            if (resp.length > 0) {
              this.LFinish(`Documentos generados: ${resp}`, () => {
                this.cerrarModal()
              });
            } else {
              this.LInfo('warning', 'Se presentó un error al intentar contabilizar los documentos, por favor intentelo de nuevo.');
            }
          }); 
      });
      
    },
    abrirModal() {
      this.$refs.modalpago.open();
    },
     cerrarModal() {
      this.$refs.modalpago.close();
    },   
  },
  watch: {
  },
  created() {
  },
};
</script>