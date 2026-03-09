<template>
  <q-drawer
    bordered
    mini-to-overlay
    v-model="showPresolicitudes"
    side="right"
    :class="showPresolicitudes ? 'fullscreen q-drawer__backdrop' : ''"
    :style="showPresolicitudes ? 'background: #2d57a0b0;' : ''"
    :width="500"
  >
    <div class="row">
      <div class="col-12 q-pa-md">
        <div class="row">
          <div class="col-11 text-bold text-center">
            FILTRAR
          </div>
          <div class="col-1 text-center">
            <q-icon
              name="close"
              class="text-bold cursor-pointer"
              style="
                background: #1948801c;
                border-radius: 17px;
                padding: 11px;
                color: #194880;
              "
              @click="cerrarSolicitudes"
            />
          </div>
        </div>
      </div>
      <q-separator style="background: #42a5f5; padding: 1px; border-radius: 15px; margin-top: 10px;" />
    </div>

    <div class="row q-mt-lg q-pa-sm q-ma-lg">
      <div class="col text-weight-bold" style="color: #194880;">
        Generar Comprobantes
      </div>
      <div class="col-7">
        <q-separator class="q-mt-sm" style="background: #194880; padding: 0px; border-radius: 15px; margin-top: 11px;"/>
      </div>
    </div>  

    <q-form ref="Formconsulta">
      <div class="row q-ma-lg">
        <div class="col-12">
          <div class="" style="min-width: 250px; max-width: 438px">
            <q-select
              rounded 
              outlined
              dense
              v-model="model.tipodoc"
              :options="documentos"
              label="Incluir en el Comprobante"
              multiple
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
                <q-item
                  v-bind="itemProps"
                  v-on="itemEvents"
                >
                  <q-item-section>
                    <q-item-label v-html="opt.label" ></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox :value="selected" @input="toggleOption(opt.value)"></q-checkbox>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>  

      <div class="row q-ma-lg">
        <q-input rounded outlined dense v-model="model.finicio" mask="date" :rules="['date']" style="width: 440px;">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="model.finicio">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

       <!--  <l-date
          col="md-12 text-black"
          v-model="model.finicio"
          label="Desde"
          colorico="primary"
          style_val="padding-right: 12px; padding-left: 2px;"
          mask="YYYY, MMM D, dddd"
          :rules="[$rules.required($t('validator.required'))]"
        /> -->
      </div>
      <div class="row q-ma-lg">  
        <q-input rounded outlined dense v-model="model.ffin" mask="date" :rules="['date']" style="width: 440px;">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="model.ffin">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- <l-date
          col="md-12 text-black"
          v-model="model.ffin"
          label="Hasta"
          colorico="primary"
          style_val="padding-right: 12px; padding-left: 2px;"
          :rules="[$rules.required($t('validator.required'))]"
        /> -->
      </div>

      <div class="row q-mt-lg q-pa-sm q-ma-lg">
        <div class="col text-weight-bold" style="color: #194880;">
          Estados
        </div>
        <div class="col-10">
          <q-separator class="q-mt-sm" style="background: #194880; padding: 0px; border-radius: 15px; margin-top: 11px;"/>
        </div>
      </div> 

      <div class="row q-pb-none text-center">
        <div class="col-md-4">
          <q-checkbox
            style="border-radius: 15px; padding: 17px;"
            class="col-md-2 text-black abiertos"
            v-model="model.estado.abiertos"
            :id="1"
            :val="1"
            label="Abiertos"
          />
        </div>
        <div class="col-md-4">
          <q-checkbox
            style="border-radius: 15px; padding: 17px;"
            class="col-md-2 text-black anulados"
            v-model="model.estado.anulados"
            :id="2"
            :val="3"
            label="Anulados"
          />
        </div>
        <div class="col-md-4">
          <q-checkbox
            style="border-radius: 15px; padding: 17px;"
            class="col-md-2 text-black cerrados"
            v-model="model.estado.cerrados"
            :id="3"
            :val="2"
            label="Cerrados"
          />
        </div>
      </div>
    </q-form>

    <div class="row justify-center q-mt-xl">
      <div class="col-5">
        <q-btn
          unelevated
          rounded
          dense
          color="warning"
          class="full-width icoFiltro q-pl-xl q-pr-xl"
          @click="filtrar"
        >
          <span class="qbtn-label">Filtrar</span>
        </q-btn>
      </div>
    </div>

  </q-drawer>
</template>
<script>
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "filtro",
  components: {},
  props: {
     value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showPresolicitudes: false,
      multiple: [],
      model: {
        tipodoc: [],
        todas: 1,
        tipo: 1,
        finicio: moment().format("YYYY/MM/DD"),
        ffin: moment().format("YYYY/MM/DD"),
        estado: {
          abiertos: false,
          anulados: false,
          cerrados: false,
        },
      },
      documentos:[
        {
          value: 1,
          label: 'Ingresos'
        },
        {
          value: 2,
          label: 'Egresos'
        },
        {
          value: 3,
          label: 'Nota contable'
        },
        {
          value: 4,
          label: 'Factura'
        },

      ],
      /* fechas: {
        finicio: moment().format("DD/MM/YYYY"),
        ffin: moment().format("DD/MM/YYYY"),
      }, */
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getProcesos("005");
  },
  methods: {
    ...mapActions("parametros", ["getProcesos"]),
    cerrarSolicitudes() {
      this.showPresolicitudes = false;
      this.$emit("cerrarSolicitudes");
    },
   
    abrirventanafiltro() {
      //   this.infopresolicitud = data;
    //   this.estado_preso = false;
    //   this.nombre_boton_crear_persona = "Crear Persona";
      setTimeout(() => {
        this.showPresolicitudes = true;
        // this.$refs.refModalPresol.open();
      }, 100);
    //   this.loadsolicitudes(data.id);
    },
    filtrar(){
      this.$emit("filtrado", {'data': this.model, 'ref': this.$refs.Formconsulta.validate()})
    }
  },
};
</script>
<style lang="scss">

  @mixin btnhover($codeicon, $png: false) {
    &:hover {
      & .qbtn-label {
        position: relative;
        &::before {
          @if ($png) {
            content: url("~assets/iconos/filtro.svg");
            top: 1px;
          } @else {
            content: $codeicon;
            font-family: "Material Icons";
            font-size: 50px;
          }
          position: absolute;
          left: -34px;
        }
      }
    }
  }

  .icoFiltro {
    @include btnhover("\e161", true);
  }

/* 
.clase_qlist .q-item {
  min-height: 26px !important;
  padding: 0px 10px !important;
  width: 101px !important;
  font-size: 10px;
}

.clase_texto_label_tab .q-tab__label {
  color: #194880 !important;
  font-weight: bold !important;
}

.clase_texto_label_tab .q-tab__indicator {
  color: #194880 !important;
} */

</style>
