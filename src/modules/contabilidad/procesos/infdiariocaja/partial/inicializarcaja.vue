<template>
  <l-modal ref="inicializar" widthdynamic="900px" heightdynamic="500px" :validar_salir="false" >
    <template slot="title">
      <!-- <div class="row full-width"> -->
        <div class="col-12 flex items-center">
          <!-- <q-icon name="point_of_sale" size="24px" /> -->
          <span class="q-ml-sm tituloModal">INICIALIZAR CAJA </span>
        </div>
    </template>
    <template slot="footer">
      <div class="row footerStile" >
        <div class="col-12 divGuardar">
          <q-btn
            dense
            class="q-mr-md btnGuardar"
            label="Inicializar Caja"
            type="buttom"
            @click="inicializarCaja()"
          >
            <!-- <q-tooltip> Guardar </q-tooltip> -->
          </q-btn>

        </div>
      </div>
    </template>
    <q-form ref="frominicializar">
      <!-- <label>Datos del primer informe diario de caja</label> -->
      <div class="row">
        <div class="row col-12 divinicio q-pt-lg q-pl-md"> 
          <div class="col-4">
            <!-- <div class="row"> -->
              <l-date
                v-model="model.fecha"
                option-label="nombre"
                label="Fecha *"
              />
            <!-- </div> -->
          </div>
          <div class="col-7 flex items-center text-justify q-ml-lg">
            <label color="primary">
            <q-icon name="info" color="primary" size="21px">

            </q-icon> 
              Al inicializar caja solo se podrán realizar
              recibos de caja con esta fecha, a menos que tenga  permiso para
              modificar la fecha.
            </label>
          </div>
        </div>
        <div class="row col-12 q-pl-lg q-pr-md q-pt-lg">
          <div class="col-3 q-pl-lg flex items-center">
            <label class="text-weight-bold" style="color:#194880">
              Saldo Inicial
            </label>
          </div>
          <div class="col-4 q-pt-md">
            <l-money
              v-model="model.efectivo"
              prefijo="$ "
              sufijo=""
              label="Efectivo *"
              :rules="[$rules.required($t('validator.required'))]"
              icon="monetization_on"
              :precision="centavos_contabilidad == true ? 2 : 0"
            />
          </div>
          <div class="col-4 q-pt-md">
            <l-money
              v-model="model.total"
              prefijo="$ "
              sufijo=""
              label="Total"
              :rules="[$rules.required($t('validator.required'))]"
              icon="monetization_on"
              :disable="
                model.arriendoventa == null || model.arriendoventa == ''
              "
              :precision="centavos_contabilidad == true ? 2 : 0"
            />
          </div>
        </div>
        <div class="row col-12 q-pl-lg q-pr-md q-pt-lg">
          <div class="col-3 q-pl-lg flex items-center">
            <label class="text-weight-bold" style="color:#194880">
              # Consecutivos
            </label>
          </div>
          <div class="col-4 q-pt-md">
            <l-input
              v-model="model.planilla"
              label="Número de la planilla diaria *"
              type="number"
            />
          </div>
          <div class="col-4 q-pt-md">
            <l-input
              v-model="model.conse_consignacion"
              label="Consecutivo de consignaciones"
              type="number"
            />
          </div>
        </div>
      </div>
    </q-form>
  </l-modal>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
export default {
  name: "inicializar",
  data() {
    return {
      model: {
        fecha: moment().format("DD/MM/YYYY"),
        planilla: 1,
        conse_consignacion: 1,
        efectivo: 0,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState("parametros", ["centavos_contabilidad"]),
  },
  methods: {
    inicializarCaja() {
      this.$emit("inicializar-caja", this.model);
      this.$refs.inicializar.close();
    },
    abrirModal() {
      this.model = {
        fecha: moment().format("DD/MM/YYYY"),
        planilla: 1,
        conse_consignacion: 1,
        efectivo: 0,
        total: 0,
      };
      this.$refs.inicializar.open();
    },
  },
  watch: {
    "model.efectivo"(val) {
      this.model.total = val;
    },
  },
};
</script>

<style>
.divborder {
  border: 1px solid lightgray;
}
.divinicio{
  background: #F9F9F9 0% 0% no-repeat padding-box;
  opacity: 1;
  padding-bottom: 15px;
}
</style>
