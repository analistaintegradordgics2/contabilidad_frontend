<template>
  <l-newmodal
    width="1300px"
    titulo="Editar Concepto"
    footer
    :validar_salir="false"
    ref="editar"
  >
    <template slot="body">
      <q-form ref="formeditar">
        <div class="row">
          <div class="col-12 q-mb-md q-pl-sm">
            <label>Documento #</label
            ><span class="text-weight-bold q-ml-sm">{{ model.documento }}</span>
          </div>
          <l-select
            col="6"
            v-model="model.concepto"
            option-value="id"
            option-label="codigo_nombre"
            :options="conceptos"
            :rules="[$rules.required($t('validator.required'))]"
            label="Concepto *"
          />
          <l-input
            col="6"
            v-model="model.detalle"
            :rules="[$rules.required($t('validator.required'))]"
            label="Detalle *"
          />
        </div>
      </q-form>
    </template>
    <template slot="footer">
      <div class="row justify-center">
        <div class="col-3">
          <q-btn
            class="full-width btn_save"
            unelevated
            rounded
            color="amber"
            @click="onSubmit"
          >
            <span class="qbtn-label">Guardar</span>
          </q-btn>
        </div>
      </div>
    </template>
  </l-newmodal>
</template>

<script>
export default {
  name: "editarconcepto",
  props: {
    tipo_consulta: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      model: {
        concepto: null,
        detalle: null,
        documento: null,
      },
      conceptos: [],
    };
  },
  methods: {
    async onSubmit() {
      const validate = await this.$refs.formeditar.validate();
      if (validate) {
        await this.Post(
          "contabilidad/documentos/editar_concepto_certificados",
          this.model
        ).then((resp) => {
          this.LConfimOK(
            "success",
            "Concepto modificado correctamente.",
            () => {
              this.$emit("actualizar");
              this.$refs.editar.close();
            }
          );
        });
      }
    },
    abrirModal(model) {
      this.getConceptos().then(() => {
        this.model = { ...model };
        this.$refs.editar.open();
      });
    },
    async getConceptos() {
      await this.Get("contabilidad/concepto").then((resp) => {
        if (this.tipo_consulta == "propietario") {
          this.conceptos = resp.filter(
            (filter) => filter.certificado_propietario == true
          );
        } else {
          this.conceptos = resp.filter(
            (filter) => filter.certificado_arrendatario == true
          );
        }
      });
    },
  },
  watch: {
    "model.concepto"(val) {
      if (val != null) {
        let result = this.conceptos.filter((filter) => filter.id == val)[0];
        this.model.detalle = result.detalle;
      } else {
        this.model.detalle = null;
      }
    },
  },
  created() {},
};
</script>

<style lang="scss">
@mixin btnaccionesmodal($codeicon) {
  &:hover {
    & .qbtn-label {
      position: relative;
      &::before {
        content: $codeicon;
        font-family: "Material Icons";
        position: absolute;
        left: -25px;
        font-size: 18px;
      }
    }
  }
}
.btn_save {
  @include btnaccionesmodal("\e161");
}
</style>