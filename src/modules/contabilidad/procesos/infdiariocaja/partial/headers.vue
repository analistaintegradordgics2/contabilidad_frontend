<template>
  <div class="row q-col-gutter-x-sm">
    <div class="col-2 q-pl-xl q-pt-lg">
      <l-date
        v-model="value.fecha"
        option-label="nombre"
        label="Fecha *"
        :options="options"
        @emit-value="aplicFecha"
        :disable="value.fecha == null ? true : false"
      />
    </div>
    <div class="col-2 q-pt-lg">
      <l-input
        v-model="value.planilla"
        label="Número de planilla"
        type="number"
        :min="1"
        :disable="true"
      />
    </div>
    <div class="row col-3 flex items-center">
      <div>
        <q-btn
          unelevated
          round
          dense
          size="12px"
          class="color_btn_nav"
          icon="chevron_left"
          :disable="value.fecha == null ? true : false || value.page == 1"
          @click="paginador(2)"
        >
          <q-tooltip v-if="value.page != 1">Anterior</q-tooltip>
        </q-btn>
      </div>
      <div class="q-pl-lg">
        <q-btn
          unelevated
          round
          dense
          size="12px"
          class="color_btn_nav"
          icon="navigate_next"
          :disable="
            value.fecha == null ? true : false || value.page == value.totalpage
          "
          @click="paginador(3)"
        >
          <q-tooltip v-if="value.page != value.totalpage">Siguiente</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row col-5 flex items-center justify-end">
      <q-btn-group push dense flat class="btngroup">
        <q-btn
          push
          flat
          class="btngroup1"
          :disable="!primera_caja"
          @click="consultar()"
        >
          <q-icon name="mdi-restart" color="primary" class="rotate-315"  size="34px"/>
          <label for="">Resfrescar</label>
          <q-tooltip> Resfrescar </q-tooltip>
        </q-btn>
        <can
          permiso="view_menu_gestion_contable_informes_informe_diario_de_caja_acciones_cerrar_caja"
          class="col-6"
          v-if="(value.estado == 'Abierta' || value.estado !== '') && value.estado != 'Cerrada' "
        >
          <q-btn
            flat
            push
            class="btngroup3"
            icon="point_of_sale"
            v-if="(value.estado == 'Abierta' || value.estado !== '') && value.estado != 'Cerrada' "

            label="Cerrar Caja"
            @click="cerrarcaja"
          >
          </q-btn>
        </can>

        <can
          permiso="view_menu_gestion_contable_informes_informe_diario_de_caja_acciones_inicializar_caja"
          class="col-6"
           v-if="value.estado !== 'Abierta'"
        >
          <q-btn
            push
            flat
            :class="!primera_caja ? 'btngroup2' : 'btngroup3'"
            icon="point_of_sale"
            :disable="primera_caja"
            :label="!primera_caja ? 'Inicializar Caja' : 'Caja cerrada'"
            v-if="value.estado !== 'Abierta'"
            @click="iniciarcaja"
          >
          </q-btn>
        </can>
      </q-btn-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "headers",
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
    primera_caja: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    paginador(accion) {
      this.$emit("emit-regresarTab")
      switch (accion) {
        case 1:
          this.value.page = 1;
          break;
        case 2:
          this.value.page--;
          break;
        case 3:
          this.value.page++;
          break;
        case 4:
          this.value.page = this.value.totalpage;
          break;
      }
    },
    aplicFecha(val) {
      this.$emit("emit-fecha", val);
    },
    iniciarcaja() {
      this.$emit("emit-iniciar-caja");
    },
    consultar() {
      this.$emit("emitconsulta");
    },
    cerrarcaja() {
      this.$emit("emit-cerrar-caja");
    },
  },
};
</script>

<style>
.color_btn_nav {
  background: #42a5f5 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #42a5f580;
  color: white;
  opacity: 1;
}
.btngroup {
  width: 100%;
  height: 100%;
}
.btngroup1 {
  width: 100%;
  height: 100%;
  background: transparent linear-gradient(180deg, #f6faff00 0%, #42a5f54f 100%)
    0% 0% no-repeat padding-box;
  opacity: 1;
  letter-spacing: 0px;
  color: #42a5f5;
}
.btngroup2 {
  width: 100%;
  height: 100%;
  background: transparent linear-gradient(180deg, #f6faff00 0%, #29c1604f 100%) 0%
    0% no-repeat padding-box;
  opacity: 1;
  letter-spacing: 0px;
  color: #29c160;
}
.btngroup3 {
  width: 100%;
  height: 100%;
  background: transparent linear-gradient(180deg, #f6faff00 0%, #e242424f 100%) 0%
    0% no-repeat padding-box;
  opacity: 1;
  letter-spacing: 0px;
  color: #e24242;
}
</style>