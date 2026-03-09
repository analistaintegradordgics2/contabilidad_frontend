<template>
  <l-newmodal
    width="1300px"
    ref="refcrearcuenta"
    persistent
    footer
    :titulo="`${editar == false ? 'Crear' : 'Editar'} cuenta`"
  >
    <template slot="body">
      <q-form ref="FormPUC" class="q-gutter-md q-pa-md">
        <div class="row">
          <div class="col-md-4 q-px-sm">
            <q-input
              dense
              outlined
              rounded
              label="Código *"
              v-model="model.codigol"
              @keydown="soloNumeros($event)"
              :rules="[$rules.required($t('validator.required'))]"
              @blur="validarCuenta"
            />
          </div>
          <l-input
            col="md-4 text-black"
            v-model="model.nombrel"
            label="Nombre *"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-select
            col="4 text-black"
            v-model="model.estado"
            value="id"
            option-label="nombre"
            :options="estado"
            label="Estado *"
            :rules="[$rules.required($t('validator.required'))]"
          />
        </div>
        <div class="row">
          <div class="col-md-4 q-mt-sm">
            <span class="q-ml-md"> Tipo de cuenta*: </span>
            <q-radio
              v-for="item in tipocuenta"
              :key="item.id"
              class="text-black q-ml-sm"
              v-model="model.tipo"
              :val="item.id"
              :label="item.nombre"
              size="sm"
              dense
              :rules="[$rules.required($t('validator.required'))]"
            />
          </div>
          <l-inputdecimal
            col="md-4 text-black"
            label="% Retención"
            v-model="model.porcentajeret"
            suffix="%"
            size_icon="19px"
            :rules="[]"
            maxlength="6"
            mask="#.###"
          />
          <div class="col-4 q-mt-sm">
            <span class="q-ml-md"> Naturaleza*: </span>
            <q-radio
              v-for="item in naturaleza"
              :key="item.id"
              class="text-black q-ml-sm"
              v-model="model.naturaleza"
              :val="item.id"
              :label="item.nombre"
              size="sm"
              dense
              :rules="[$rules.required($t('validator.required'))]"
            />
          </div>
        </div>
        <div class="row q-mb-lg">
          <l-select
            col="4 text-black"
            v-model="model.conceptos_fc"
            value="id"
            option-label="nombre"
            :options="conceptosfc"
            label="Flujo de efectivo"
            size_icon="19px"
            :rules="[]"
          />
          <l-select
            col="4 text-black"
            v-model="model.estruct_balniif"
            value="id"
            option-label="descripcion"
            :options="estruct_balniif"
            label="Rubro balance"
            size_icon="19px"
            :rules="[]"
          />
          <l-select
            col="4 text-black"
            v-model="model.estruct_erniif"
            value="id"
            option-label="descripcion"
            :options="estruct_erniif"
            label="Rubro ER"
            size_icon="19px"
            :rules="[]"
          />
        </div>
        <div class="row q-pa-md">
          <strong style="color: #194880"> Atributos de la Cuenta </strong>
          <q-separator
            style="
              background: #194880;
              margin-left: 300px;
              width: 60%;
              margin-top: 12px;
            "
          />
        </div>
        <div class="col-md-12 q-mt-md">
          <div class="row">
            <q-checkbox
              class="col-md-3 text-black"
              v-model="configuracion"
              :id="item.id"
              :val="item.id"
              :label="item.nombre"
              v-for="item in tipo_configuracion"
              :key="item.id"
              :disable="item.activo"
            />
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
      tipocuenta: [
        { id: "General", nombre: "General" },
        { id: "Auxiliar", nombre: "Auxiliar" },
      ],
      estado: [
        { id: "Activa", nombre: "Activa" },
        { id: "Inactiva", nombre: "Inactiva" },
      ],
      naturaleza: [
        { id: "Debito", nombre: "Debito" },
        { id: "Crédito", nombre: "Crédito" },
      ],
      tipo_configuracion: [
        {
          id: 1,
          nombre: "Cuenta NIIF",
          fiel: "niif",
          activo: false,
        },
        {
          id: 2,
          nombre: "Centro de costos",
          fiel: "ccosto",
          activo: true,
        },
        {
          id: 3,
          nombre: "Cuenta por cobrar",
          fiel: "cxc",
          activo: true,
        },
        {
          id: 4,
          nombre: "Cuenta por pagar",
          fiel: "cxp",
          activo: true,
        },
        {
          id: 5,
          nombre: "Maneja NITS",
          fiel: "nits",
          activo: true,
        },
        {
          id: 6,
          nombre: "Flujo de efectivos",
          fiel: "flujocaja",
          activo: true,
        },
        {
          id: 7,
          nombre: "Solicita base retención",
          fiel: "base",
          activo: true,
        },
        {
          id: 8,
          nombre: "Nit tercero",
          fiel: "nittercero",
          activo: true,
        },
      ],
      temp_config: [],
      activar_config: true,
      conceptosfc: [],
      estruct_balniif: [],
      estruct_erniif: [],
      configuracion: [],
      mayor: [],
      model: {
        id: null,
        codigol: null,
        nombrel: null,
        tipo: null,
        porcentajeret: "0",
        naturaleza: null,
        conceptos_fc: null,
        estruct_balniif: null,
        estruct_erniif: null,
        estado: null,
      },
      validacion: true,
      editar: false,
      codigol: null,
    };
  },
  computed: {
    ...mapState("inmueble", ["inmueble_store"]),
  },
  methods: {
    ...mapActions("generales", ["soloNumeros"]),
    abrirmodal() {
      this.$refs.refcrearcuenta.open();
    },
    abrir(model) {
      this.configuracion = []
      const propiedadesConfigurables = ['niif', 'ccosto', 'cxc', 'cxp', 'nits', 'flujocaja', 'base', 'nittercero']

      for (let i = 0; i < propiedadesConfigurables.length; i++) {
        if (model[propiedadesConfigurables[i]]) {
          this.configuracion.push(i + 1)
        }
      }
      this.model = model;
      this.$refs.refcrearcuenta.open();
    },
    validarCuenta() {
      if (this.model.codigol != null) {
        if (this.model.tipo == "Auxiliar" && this.model.codigol.length < 6) {
          this.validacion = false;
          return this.mdialog(
            "warning",
            "Las cuentas auxiliares no pueden tener menos de 6 dígitos."
          );
        } else {
          if (this.model.codigol.length == 1) {
            var contador = 0;
            this.mayor.forEach((item, i) => {
              if (item.codigol.length == 1) {
                if (item.codigol == this.model.codigol) {
                  contador = contador + 1;
                }
              }
            });
            var result = [];
            if (this.editar == true) {
              var val = 0;
              result = this.mayor.filter(
                (filtro) => filtro.codigol.length == 2
              );
              result.forEach((element) => {
                var spcodigo = element.codigol.split("");
                if (spcodigo[0] == this.value.codigol) {
                  val = val + 1;
                }
              });
              if (val == 0) {
                this.validacion = true;
              } else {
                this.validacion = false;
                return this.mdialog(
                  "warning",
                  "No se puede modificar la cuenta, ya contiene cuentas auxiliares."
                );
              }
            }
            if (this.codigol != this.model.codigol) {
              if (contador == 0) {
                //Aca se debe guarda
                this.validacion = true;
              } else {
                this.validacion = false;
                return this.mdialog(
                  "warning",
                  "El código de la cuenta ya existe en el sistema."
                );
              }
            }
          } else if (this.model.codigol.length % 2 == 0) {
            //Validacion para que siempre se ingrecen de a dos numeros por codigo
            if (this.model.codigol.length == 2) {
              // Validar si la cuenta ingresada ya existe.
              var existe = false;
              this.mayor.forEach((item, i) => {
                if (item.codigol == this.model.codigol) {
                  if (this.codigol != this.model.codigol) {
                    existe = true;
                  }
                }
              });
              if (existe != true) {
                //Validar si el codigo es de solo 2 digitos para restar solo 1 digito.
                var codigoPadre = this.model.codigol.split("");
                var contador = 0;
                var index = 0;
                var existePadre = false;
                this.mayor.forEach((item, i) => {
                  if (item.codigol == codigoPadre[0]) {
                    index = i;
                    existePadre = true;
                  }
                });
                var result = [];
                if (this.editar == true) {
                  result = this.mayor.filter((filtro) =>
                    filtro.codigol.match(this.value.codigol)
                  );
                  if (result.length >= 2) {
                    this.validacion = false;
                    return this.mdialog(
                      "warning",
                      "No se puede modificar la cuenta, ya contiene cuentas auxiliares."
                    );
                  } else {
                    this.validacion = true;
                  }
                }
                if (existePadre == true) {
                  if (this.mayor[index].tipo == "Auxiliar") {
                    // Se valida si la cuenta padre que se encontro sea de tipo auxiliar, si es asi no se puede guardar.
                    this.validacion = false;
                    return this.mdialog(
                      "warning",
                      "La cuenta general es de tipo auxiliar, no se puede crear esta cuenta."
                    );
                  } else {
                    contador = contador + 1;
                  }
                  if (contador > 0) {
                    //Aca se debe guardar
                    this.validacion = true;
                  }
                } else {
                  this.validacion = false;
                  return this.mdialog(
                    "warning",
                    "No existe cuenta general para este código."
                  );
                }
              } else {
                this.validacion = false;
                return this.mdialog(
                  "warning",
                  "El código de la cuenta ya existe en el sistema."
                );
              }
            } else {
              // Validar si la cuenta ingresada ya existe.
              var existe = false;
              this.mayor.forEach((item, i) => {
                if (item.codigol == this.model.codigol) {
                  if (this.codigol != this.model.codigol) {
                    existe = true;
                  }
                }
              });
              if (existe != true) {
                var codigo = this.model.codigol.split("");
                codigo.splice(codigo.length - 2, 2);
                var codigoPadre = codigo.join("");
                var contador = 0;
                var index = 0;
                var existePadre = false;
                this.mayor.forEach((item, i) => {
                  if (item.codigol == codigoPadre) {
                    index = i;
                    existePadre = true;
                  }
                });
                var result = [];
                if (this.editar == true) {
                  result = this.mayor.filter((filtro) =>
                    filtro.codigol.match(this.value.codigol)
                  );
                  if (result.length >= 2) {
                    this.validacion = false;
                    return this.mdialog(
                      "warning",
                      "No se puede modificar la cuenta, ya contiene cuentas auxiliares."
                    );
                  } else {
                    this.validacion = true;
                  }
                }
                if (existePadre == true) {
                  if (this.mayor[index].tipo == "Auxiliar") {
                    // Se valida si la cuenta padre que se encontro sea de tipo auxiliar, si es asi no se puede guardar.
                    this.validacion = false;
                    return this.mdialog(
                      "warning",
                      "La cuenta general es de tipo auxiliar, no se puede crear esta cuenta."
                    );
                  } else {
                    contador = contador + 1;
                  }
                  if (contador > 0) {
                    //Aca tambien se puede guardar
                    this.validacion = true;
                  }
                } else {
                  this.validacion = false;
                  return this.mdialog(
                    "warning",
                    "No existe cuenta general para este código."
                  );
                }
              } else {
                this.validacion = true;
                return this.mdialog(
                  "warning",
                  "El código de la cuenta ya existe en el sistema."
                );
              }
            }
          } else {
            this.validacion = false;
            return this.mdialog("warning", "El código ingresado no es válido.");
          }
        }
      }
    },
    async onSubmit() {
      if (this.validacion == true) {
        const validate = await this.$refs.FormPUC.validate();
        if (validate) {
          var msg = "";
          if (this.editar == true) {
            msg = "Cuenta editada correctamente.";
            this.tipo_configuracion.forEach((element) => {
              Object.keys(this.model).forEach((key) => {
                if (element.fiel == key) {
                  this.model[key] = false;
                }
              });
            });
            this.tipo_configuracion.forEach((element) => {
              this.configuracion.forEach((item) => {
                if (element.id == item) {
                  this.model[element.fiel] = true;
                }
              });
            });
            this.model["um_id"] = this.$store.getters["auth/user"].id;
          } else {
            msg = "Cuenta creada correctamente.";
            this.tipo_configuracion.forEach((element) => {
              this.configuracion.forEach((item) => {
                if (element.id == item) {
                  this.model[element.fiel] = true;
                }
              });
            });
            this.model["uc_id"] = this.$store.getters["auth/user"].id;
            this.model["um_id"] = null;
          }
          await this.Post("contabilidad/mayor", this.model).then((resp) => {
            if (resp == "OK") {
              this.LFinish(
                msg,
                () => {
                  if (this.editar == true) {
                    this.$emit("cerrar");
                    this.onReset();
                  } else {
                    this.$emit("recargar");
                    this.onReset();
                  }
                  this.$refs.refcrearcuenta.close();
                },
                false
              );
            } else {
              this.LInfo("warning", resp);
            }
          });
        }
      } else {
        this.mdialog(
          "warning",
          "Verifique el código ingresado, no se puede utilizar."
        );
      }
    },
    onReset() {
      if (this.editar == true) {
        setTimeout(() => {
          this.$emit("cerrar");
        }, 100);
      } else {
        this.model = {
          id: null,
          codigo: null,
          nombre: null,
          tipo: null,
          porcentajeret: "0",
          naturaleza: null,
          flujo: null,
          estruct_balniif: null,
          er: null,
          estado: null,
        };
        this.configuracion = [];
        this.tipo_configuracion.forEach((element) => {
          if (element.id == 1) {
            element.activo = false;
          } else {
            element.activo = true;
          }
        });
      }
    },
    async getMayor() {
      try {
        const data = await this.Get("contabilidad/mayor");
        this.mayor = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getConceptosFC() {
      try {
        const data = await this.Get("contabilidad/conceptosfc");
        this.conceptosfc = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getEstruct_balniif() {
      try {
        const data = await this.Get("contabilidad/estruct_balniif");
        this.estruct_balniif = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getEstruct_erniif() {
      try {
        const data = await this.Get("contabilidad/estruct_erniif");
        this.estruct_erniif = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    mdialog(icono, mensaje) {
      this.LInfo(icono, mensaje);
    },
  },
  watch: {
    "model.tipo"(val) {
      if (val == "Auxiliar") {
        if (this.editar == true && this.mayor.length > 1) {
          this.validarCuenta();
        }
        this.tipo_configuracion.forEach((element) => {
          element.activo = false;
        });
        if (this.model.codigol.length < 6) {
          this.validacion = false;
          return this.mdialog(
            "warning",
            "Las cuentas auxiliares no pueden tener menos de 6 dígitos."
          );
        }
      } else if (val == "General") {
        this.tipo_configuracion.forEach((element) => {
          if (element.id == 3 || element.id == 5 || element.id == 7) {
            element.activo = false;
          } else if (element.id == 1) {
            element.activo = false;
          } else {
            this.configuracion.forEach((item, i) => {
              if (item == element.id) {
                this.configuracion.splice(i, 1);
              }
            });
            element.activo = true;
          }
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value != undefined) {
        this.codigol = this.value.codigol;
        this.editar = true;
        this.tipo_configuracion.forEach((element) => {
          this._.forEach(this.value, (value, key) => {
            if (element.fiel == key) {
              if (value == 1) {
                this.configuracion.push(element.id);
              }
            }
            this.model[key] = value;
          });
        });
      } else {
        this.codigol = "";
      }
    });
  },
  created() {
    this.getMayor();
    this.getConceptosFC();
    this.getEstruct_balniif();
    this.getEstruct_erniif();
  },
};
</script>
<style scoped>
</style>
