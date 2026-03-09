<template>
  <l-newmodal footer ref="refcreartipodoc" persistent width="1300px" :titulo="editar == false ? 'NUEVO TIPO DE DOCUMENTO' : 'EDITAR TIPO DE DOCUMENTO'">
    <template slot="title">
      <span
        class="tituloModal q-ml-sm titulocard text-bold"
      >{{editar == false ? "NUEVO TIPO DE DOCUMENTO" : "EDITAR TIPO DE DOCUMENTO"}}</span>
    </template>
    <template slot="body">
      <div class="q-py-xl">
        <q-form @submit="onSubmit" @reset="onReset" ref="Formtipodoc" class="q-gutter-md">
          <div class="row">
              <l-input
                col="md-3 text-black"
                v-model="model.tipo"
                label="Código *"
                :rules="[$rules.required($t('validator.required'))]"
                @blur="validarCodigo"
                :disable="editar == true"
              />
              <l-select
                col="3 text-black"
                v-model="model.fuentes"
                value="id"
                option-label="nombre"
                :options="fuentes"
                label="Fuente *"
                :rules="[$rules.required($t('validator.required'))]"
                :disable="editar == true"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.nombre"
                label="Nombre *"
                :rules="[$rules.required($t('validator.required'))]"
              />
              <l-select
                col="3 text-black"
                v-model="model.estado"
                value="id"
                option-label="nombre"
                :options="estado"
                label="Estado *"
                :rules="[$rules.required($t('validator.required'))]"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.numero"
                label="Ultimo numero *"
                :rules="[
                  (val) =>
                    validarNumeroResolucion(val) ||
                    'Ultimo número mayor a la resolución',
                  $rules.required($t('validator.required')),
                ]"
                type="number"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.ndigitos"
                :label="`Numero de dígitos ${model.fuentes != 4 ? '*' : ''}`"
                :rules="[
                  model.fuentes != 4
                    ? $rules.required($t('validator.required'))
                    : true,
                  (val) =>
                    val <= 7 || 'Máximo de numeros de dígitos permitidos (7)',
                ]"
                type="number"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.prefijo"
                label="Prefijo"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.dias_vencimiento"
                label="Días de vencimiento *"
                :rules="[$rules.required($t('validator.required')), $rules.integer($t('validator.integer')), $rules.minValue(0, 'Debe ser mayor o igual a 0')]"
                v-if="model.fuentes === 4"
              />
              
              <l-select
                col="3 text-black"
                v-model="model.tipo_electronica"
                value="id"
                option-label="nombre"
                :options="tipo_electronica"
                label="Facturación electrónica *"
                :rules="[$rules.required($t('validator.required'))]"
                v-if="mostar_ocultar == true && !model.proveedor"
              />
              <l-select
                col="6 text-black"
                v-model="model.tipo_documento_nota_debito"
                :options="tp_doc_fuente_factura"
                label="Tipo documento para nota débito *"
                :rules="[$rules.required($t('validator.required'))]"
                v-if="model.fuentes == 4 && model.es_nota == false && model.tipo_electronica == 1"
              />
              <l-select
                col="6 text-black"
                v-model="model.tipo_documento_nota_credito"
                :options="tp_doc_fuente_factura"
                label="Tipo documento para nota crédito *"
                :rules="[$rules.required($t('validator.required'))]"
                v-if="model.fuentes == 4 && model.es_nota == false && model.tipo_electronica == 1"
              />
              <l-select
                col="6 text-black"
                v-model="model.tipo_documento_nota_credito"
                :options="tp_doc_fuente_factura"
                label="Tipo documento para nota de ajuste *"
                :rules="[$rules.required($t('validator.required'))]"
                v-if="model.fuentes == 4 && model.es_nota == false && model.tipo_electronica == 4"
              />
              <div class="col-3" v-if="model.fuentes == 4">
                <q-checkbox
                  v-model="model.es_nota"
                  label="¿Es Nota crédito o débito?"
                />
              </div>
              <div class="col-3" v-if="model.es_nota">
                <q-checkbox
                  v-model="model.es_nota_credito"
                  label="¿Es Nota crédito?"
                />
              </div>
              <div class="col-3" v-if="model.fuentes == 4 && model.tipo_electronica == 1">
                <q-checkbox
                  v-model="model.mandato"
                  label="Mandato"
                />
              </div>
              <div class="col-3" v-if="model.fuentes == 4">
                <q-checkbox
                  v-model="model.proveedor"
                  label="Factura Proveedor"
                />
              </div>
              <div class="col-3" v-if="model.fuentes == 4">
                <q-checkbox
                  v-model="model.factura_propia"
                  label="Factura Propia"
                />
              </div>
              <div class="col-12 q-pl-sm q-py-md" v-if="model.fuentes == 4">
                <label class="text-weight-bold">Datos de resolución</label>
              </div>
              <l-input
              col="md-3 text-black"
              v-model="model.numeracion_inicial"
              :label="`Numeración desde ${
                  model.fuentes == 4 && model.es_nota == false ? '*' : ''
                }`"
                type="number"
                :rules="[
                  model.fuentes == 4 && model.es_nota == false
                    ? $rules.required($t('validator.required'))
                    : true,
                  ]"
                v-if="model.fuentes == 4"
              />
              <l-input
                col="md-3 text-black"
                v-model="model.numeracion_final"
                :label="`Numeración hasta ${
                  model.fuentes == 4 && model.es_nota == false ? '*' : ''
                }`"
                type="number"
                :rules="
                  model.fuentes == 4 && model.es_nota == false
                    ? [
                        (val) => parseInt(val) > 0 || 'ESTE CAMPO ES REQUERIDO.',
                        $rules.required($t('validator.required')),
                      ]
                    : [true]
                "
                v-if="model.fuentes == 4"
                />
              <l-date
                col="md-3 text-black"
                v-model="model.fecha_ini_resolucion"
                label="Fecha inicio de resolución"
                colorico="primary"
                v-if="model.fuentes == 4"
              />
              <l-date
              col="md-3 text-black"
                v-model="model.fecha_fin_resolucion"
                label="Fecha fin de resolución"
                colorico="primary"
                v-if="model.fuentes == 4"
                />
              <l-input
                col="md-3 text-black"
                v-model="model.numero_resolucion"
                label="Número de resolución"
                v-if="model.fuentes == 4"
                />
              <l-input
              col="md-9 text-black"
              v-model="model.observacion_resolucion"
              label="Observación de resolución"
                icon="create"
                type="textarea"
                rows="1"
                v-if="model.fuentes == 4"
                />
              <q-checkbox
              v-model="model.numeracionxmes"
              :val="true"
              label="Número de meses"
              />
              <div
                class="col-12 row q-mt-md"
                v-if="model.fuentes != null && model.fuentes != 3"
                >
                <l-select
                col="3 text-black"
                v-model="model.forma_pago"
                value="id"
                option-label="nombre"
                :options="formasdepago"
                label="Forma de pago"
                :rules="[true]"
                v-if="model.fuentes != 4"
                />
                <l-select
                col="3 text-black"
                v-model="model.f_pago"
                value="id"
                  option-label="nombre"
                  :options="forma_pago_fact_elect"
                  label="Forma de pago *"
                  :rules="[$rules.required($t('validator.required'))]"
                  v-if="model.fuentes == 4"
                />
                <l-select
                  col="3 text-black"
                  v-model="model.medio_pago"
                  value="id"
                  option-label="nombre"
                  :options="medio_pago"
                  label="Medio de pago *"
                  :rules="[$rules.required($t('validator.required'))]"
                  v-if="model.fuentes == 4"
                  />
              </div>
              <div class="col-12 q-pl-sm q-py-md" v-if="model.fuentes == 4">
                <label class="text-weight-bold">Datos de transmisión</label>
              </div>
              <l-input
                v-if="model.fuentes == 4"
                col="md-3 text-black"
                v-model="model.fact_elec_user"
                label="Usuario de facturación electrónica *"
                :rules="[$rules.required($t('validator.required'))]"
                :disable="!$store.state.auth.user.is_superuser"
              />
              <l-input
                v-if="model.fuentes == 4"
                col="md-3 text-black"
                v-model="model.fact_elec_pass"
                label="Clave de facturación electrónica *"
                :rules="[$rules.required($t('validator.required'))]"
                :disable="!$store.state.auth.user.is_superuser"
              />
              <l-input
                v-if="model.fuentes == 4"
                col="md-3 text-black"
                v-model="model.fact_elec_url"
                label="URL de facturación electrónica *"
                :rules="[$rules.required($t('validator.required'))]"
                :disable="!$store.state.auth.user.is_superuser"
              />
            </div>
          </q-form>
        </div>
      </template>
      <template slot="footer">
        <div class="row justify-center">
          <div class="col-4">
            <q-btn dense class="q-mr-md btnGuardar" label="¡Listo!" type="buttom" @click="onSubmit"/>
          </div>
      </div>
    </template>
  </l-newmodal>
</template>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";
export default {
  layout: "main",
  name: "Crear",
  components: {},
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      estado: [
        { id: "Activo", nombre: "Activo" },
        { id: "Inactivo", nombre: "Inactivo" }
      ],
      tipo_electronica: [
        { id: 1, nombre: "Facturación Electrónica" },
        { id: 2, nombre: "Nota Débito" },
        { id: 3, nombre: "Nota Crédito" },
        { id: 4, nombre: "Documento Soporte" },
      ],
      model: {
        id: null,
        fuentes: null,
        tipo: null,
        numero: null,
        ndigitos: null,
        prefijo: null,
        dias_vencimiento: null,
        numeracionxmes: false,
        estado: null,
        tipo_electronica: null,
        forma_pago: null,
        numeracion_inicial: 0,
        numeracion_final: 0,
        fecha_ini_resolucion: null,
        fecha_fin_resolucion: null,
        numero_resolucion: null,
        observacion_resolucion: null,
        es_nota: false,
        f_pago: null,
        medio_pago: null,
        mandato: false,
        tipo_documento_nota_debito: null,
        tipo_documento_nota_credito: null,
        es_nota_credito: false,
        proveedor: false,
        factura_propia: false,
      },
      tiposdocumentos: [],
      formasdepago: [],
      editar: false,
      fuentes: [],
      conceptosfc: [],
      validacion: true,
      temp_codigo: null,
      tp_doc_fuente_factura: []
    };
  },
  computed: {
    ...mapState("contabilidad", ["mostar_ocultar"]),
    ...mapState("generales", ["medio_pago", "forma_pago_fact_elect"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["getMedioPago", "getFormaPagoFactElect"]),
    ...mapMutations("contabilidad", ["SET_MOSTRAR_OCULTAR"]),
    abrir(model) {
      this.model = model;

      this.editar = true;
      this.validacion = true;
      setTimeout(() => {
        this.$refs.refcreartipodoc.open();
      }, 500);
    },
    validarCodigo() {
      if (this.temp_codigo != this.model.tipo) {
        const filtar = this.tiposdocumentos.filter(
          filtro => filtro.tipo == this.model.tipo.trim()
        );
        if (filtar.length > 0) {
          this.validacion = false;
          this.LInfo("warning", "El código ingresado ya existe en el sistema");
        } else {
          this.validacion = true;
        }
      }
    },
    async onSubmit() {
      if (this.validacion == true) {
        try {
          const validate = await this.$refs.Formtipodoc.validate();
          if (validate) {
            var msg = "";
            if (this.editar == true) {
              msg = "Tipo de documento editado correctamente.";
              this.model["um_id"] = this.$store.getters["auth/user"].id;
            } else {
              msg = "Tipo de documento creado correctamente.";
              this.model["uc_id"] = this.$store.getters["auth/user"].id;
              this.model["um_id"] = null;
            }
            this.model.tipo = this.model.tipo.trim();
            if (this.model.prefijo != null) {
              this.model.prefijo = this.model.prefijo.trim();
            }
            let params = { ...this.model };
            if ([4].includes(this.model.fuentes)) {
              if (
                this.model.fecha_ini_resolucion != null ||
                this.model.fecha_fin_resolucion != null
              ) {
                if (
                  moment(
                    this.model.fecha_ini_resolucion,
                    ["DD/MM/YYYY", "DD-MM-YYYY"],
                    true
                  ).isValid() &&
                  moment(
                    this.model.fecha_fin_resolucion,
                    ["DD/MM/YYYY", "DD-MM-YYYY"],
                    true
                  ).isValid()
                ) {
                  params.fecha_ini_resolucion = moment(
                    this.model.fecha_ini_resolucion,
                    "DD/MM/YYYY"
                  ).format("YYYY-MM-DD");
                  params.fecha_fin_resolucion = moment(
                    this.model.fecha_fin_resolucion,
                    "DD/MM/YYYY"
                  ).format("YYYY-MM-DD");
                  if (
                    params.fecha_ini_resolucion >= params.fecha_fin_resolucion
                  ) {
                    this.LInfo(
                      "warning",
                      "Rango de fechas de resolución invalidos."
                    );
                    return;
                  }
                } else {
                  this.LInfo("warning", "Fechas de resolución invalidas.");
                  return;
                }
              }
            } else {
              this.model.numeracion_inicial = 0;
              this.model.numeracion_final = 0;
              this.model.fecha_ini_resolucion = null;
              this.model.fecha_fin_resolucion = null;
              this.model.numero_resolucion = null;
              this.model.observacion_resolucion = null;
              this.model.dias_vencimiento = 0;
            }
            params.dias_vencimiento = params.dias_vencimiento || 0;
            params.ndigitos = params.ndigitos != "" ? params.ndigitos : 0;

             
            await this.Post({
              api: "contabilidad/tiposdocumentos",
              model: params
            });
            this.$refs.Formtipodoc.reset();
            this.LFinish(
              msg,
              () => {
                if (this.editar == true) {
                  this.$emit("cerrar");
                  this.$refs.refcreartipodoc.close();
                } else {
                  this.$emit("recargar");
                  this.onReset();
                  this.$refs.refcreartipodoc.close();
                }
              },
              false
            );
          }
        } catch ({ message }) {
          console.error(message);
        }
      } else {
        this.LInfo("warning", "El código ingresado ya existe en el sistema");
      }
    },
    onReset() {
      this.model = {
        id: null,
        fuentes: null,
        tipo: null,
        numero: null,
        ndigitos: null,
        dias_vencimiento: null,
        prefijo: null,
        numeracionxmes: false,
        estado: null,
        tipo_electronica: null,
        forma_pago: null,
        numeracion_inicial: 0,
        numeracion_final: 0,
        fecha_ini_resolucion: null,
        fecha_fin_resolucion: null,
        numero_resolucion: null,
        observacion_resolucion: null,
        es_nota: false,
        f_pago: null,
        medio_pago: null,
        mandato: false,
        es_nota_credito: false,
        proveedor:false,
        factura_propia:false,
      };
      this.validacion = false;
    },
    validarNumeroResolucion(val) {
      try {
        if (this.model.fuentes == 4 && this.model.es_nota == false) {
          if (parseInt(val) > parseInt(this.model.numeracion_final)) {
            return false;
          }
        }
      } catch {
        return true;
      }
      return true;
    },
    async GetTiposdocumentos() {
      try {
        const data = await this.Get({ api: "contabilidad/tiposdocumentos" });
        this.tiposdocumentos = data;
        this.tp_doc_fuente_factura = data.filter((f) => f.fuentes == 4 && f.es_nota == true && f.estado.toLowerCase() == "activo");
      } catch ({ message }) {
        console.error(message);
      }
    },
    async GetFomaPago() {
      try {
        const data = await this.Get({ api: "parametrizacion/forma_pago" });
        this.formasdepago = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getFuentes() {
      try {
        const data = await this.Get({ api: "contabilidad/fuentes" });
        this.fuentes = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    abrirmodal() {
      this.onReset()
      setTimeout(() => {
        this.$refs.refcreartipodoc.open();
      }, 500);
      this.GetTiposdocumentos()
    }
  },
  watch: {
    "model.fuentes"(val) {
      if (this.editar == false) {
        this.model.forma_pago = null;
      }
      if (val == 4) {
        this.$store.commit("contabilidad/SET_MOSTRAR_OCULTAR", true);
      } else {
        this.$store.commit("contabilidad/SET_MOSTRAR_OCULTAR", false);
        this.model.mandato = false;
      }
    },
    "model.tipo_electronica"(val) {
      if (val != 1) {
        this.model.mandato = false;
      }
    },
    "model.es_nota"(val) {
      if (val == true) {
        this.model.tipo_documento_nota_debito = null;
        this.model.tipo_documento_nota_credito = null;
      }
    },
    "model.tipo_electronica"(val) {
      if (val != 1) {
        this.model.tipo_documento_nota_debito = null;
        if (val != 4) {
          this.model.tipo_documento_nota_credito = null;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // if (this.value != null || this.model != null) {
      //   this.editar = true;
      //   this.model = this.value;
      //   this.temp_codigo = this.value;
      // }
    });
    this.GetTiposdocumentos();
  },
  created() {
    this.getFuentes();
    this.GetFomaPago();
    this.getMedioPago();
    this.getFormaPagoFactElect();
  },
};
</script>
<style scoped>
</style>
