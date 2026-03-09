<template>
  <l-newmodal
    width="1300px"
    ref="refcrearconcepto"
    persistent
    footer
    :titulo="`${editar == false ? 'Crear' : 'Editar'} concepto`"
  >
    <template slot="body">
      <q-form ref="Formconcepto" class="q-gutter-md">
        <div class="row q-pa-md">
          <div class="col-3 q-px-sm">
            <q-input
              dense
              outlined
              rounded
              v-model="model.codigo"
              label="Código *"
              :rules="[$rules.required($t('validator.required'))]"
              @keydown="soloNumeros($event)"
              @blur="validarCodigo"
              maxlength="3"
            />
          </div>
          <l-input
            col="md-4 text-black"
            v-model="model.nombre"
            label="Nombre *"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-select
            col="3 text-black"
            v-model="model.conceptos_fc"
            value="id"
            option-label="nombre"
            :options="conceptosfc"
            label="Flujo de caja"
          />
          <div class="col-2">
            <q-checkbox
              v-model="model.retencion"
              :val="true"
              label="Aplica para retención"
            />
          </div>
          <div class="col-7">
            <l-input
              col="md-12 q-mb-md text-black"
              :readonly="false"
              v-model="model.detalle"
              label="Detalle"
              type="textarea"
              rows="3"
              hint="Máximo 255 caracteres"
              :rules="[
                (val) =>
                  val.length <= 255 || 'Máximo de caracteres permitidos (255)',
              ]"
            />
          </div>
          <div class="col-12">
            <div class="row q-gutter-md">
              <div>
                <q-checkbox
                  v-model="model.certificado_propietario"
                  :val="true"
                  label="Certificado propietario"
                />
              </div>
              <l-select
                col="3"
                v-model="model.tipo_certificado_propietario"
                value="id"
                option-label="label"
                emit-value
                map-options
                :options="tipos"
                label="Tipo para certificado de propietario"
                :rules="
                  model.certificado_propietario == true
                    ? [$rules.required($t('validator.required'))]
                    : []
                "
              />
              <div>
                <q-checkbox
                  v-model="model.certificado_arrendatario"
                  :val="true"
                  label="Certificado Arrendatario"
                />
              </div>
              <l-select
                col="3"
                v-model="model.tipo_certificado_arrendatario"
                value="id"
                option-label="label"
                emit-value
                map-options
                :options="tipos"
                label="Tipo para certificado de arrendatario"
                :rules="
                  model.tipo_certificado_arrendatario == true
                    ? [$rules.required($t('validator.required'))]
                    : []
                "
              />
              <q-checkbox
                v-model="model.impuesto_automatico"
                :val="true"
                label="Concepto de gravamen a los movimientos financieros (GMF)"
              />
            </div>
          </div>
        </div>
      </q-form>
    </template>
    <template slot="footer">
      <div class="row justify-center">
        <div class="col-4">
          <q-btn
            class="full-width"
            dense
            rounded
            color="amber"
            label="¡Listo!"
            @click="onSubmit"
          />
        </div>
      </div>
    </template>
  </l-newmodal>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  layout: "main",
  name: "Crear",
  components: {},
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      model: {
        id: null,
        codigo: null,
        nombre: null,
        detalle: "",
        conceptos_fc: null,
        certificado_propietario: false,
        certificado_arrendatario: false,
        tipo_certificado_propietario: null,
        tipo_certificado_arrendatario: null,
        retencion: false,
        impuesto_automatico: false,
      },
      editar: false,
      concepto: [],
      conceptosfc: [],
      validacion: true,
      temp_codigo: null,
      tipos: [
        {
          id: "INGRESO",
          label: "Ingreso",
        },
        {
          id: "DESCUENTO",
          label: "Descuento",
        },
        {
          id: "TERCERO",
          label: "TERCERO",
        },
      ],
    };
  },
  computed: {
    ...mapState("inmueble", ["inmueble_store"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    ...mapActions("generales", ["soloNumeros"]),
    abrir(model) {
      this.model = model;
      this.temp_codigo = model.codigo;
      this.editar = true;
      this.validacion = true;
      this.getConcepto().then(() => {
        this.$refs.refcrearconcepto.open();
      });
    },
    validarCodigo() {
      if (this.temp_codigo != this.model.codigo) {
        if (this.model.codigo != "" && this.model.codigo != null) {
          const filtar = this.concepto.filter(
            (f) => f.codigo === parseInt(this.model.codigo)
          );
          if (filtar.length > 0) {
            this.validacion = false;
            this.LInfo(
              "warning",
              "El código ingresado ya existe en el sistema"
            );
          } else {
            if (parseInt(this.model.codigo) > 0) {
              this.validacion = true;
            } else {
              this.LInfo(
                "warning",
                "El código ingresado debe ser mayor a cero."
              );
            }
          }
        }
      }
    },
    async onSubmit() {
      if (this.validacion == true) {
        const validate = await this.$refs.Formconcepto.validate();
        if (validate) {
          var msg = "";
          if (this.editar == true) {
            msg = "Concepto editado correctamente.";
            this.model["um_id"] = this.$store.getters["auth/user"].id;
          } else {
            msg = "Concepto creado correctamente.";
            this.model["uc_id"] = this.$store.getters["auth/user"].id;
            this.model["um_id"] = null;
          }
          await this.Post({
            api: "contabilidad/concepto",
            model: this.model,
          });
          this.LFinish(
            msg,
            () => {
              if (this.editar == true) {
                this.$emit("cerrar");
                this.$refs.refcrearconcepto.close();
                this.onReset();
              } else {
                this.$refs.refcrearconcepto.close();
                this.$emit("recargar");
                this.onReset();
              }
            },
            false
          );
        }
      } else {
        this.LInfo("warning", "El código ingresado ya existe en el sistema");
      }
    },
    onReset() {
      this.model = {
        id: null,
        codigo: null,
        nombre: null,
        detalle: "",
        conceptos_fc: null,
        certificado_propietario: false,
        certificado_arrendatario: false,
        tipo_certificado_propietario: null,
        tipo_certificado_arrendatario: null,
        retencion: false,
        impuesto_automatico: false,
      };
      this.temp_codigo = null;
      this.validacion = true;
    },
    async getConcepto() {
      try {
        const data = await this.Get({ api: "contabilidad/concepto" });
        this.concepto = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getConceptosFC() {
      try {
        const data = await this.Get({ api: "contabilidad/conceptosfc" });
        this.conceptosfc = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    abrirmodal() {
      this.getConcepto().then(() => {
        this.$refs.refcrearconcepto.open();
      });
    },
  },
  created() {
    this.getConceptosFC();
  },
};
</script>
<style scoped>
</style>
