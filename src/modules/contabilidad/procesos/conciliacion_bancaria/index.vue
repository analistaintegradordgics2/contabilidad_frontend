<template>
  <div class="q-ma-lg q-ml-xl">
    <q-card flat bordered>
      <q-card-section class="row bg-primary text-white q-pa-sm">
        <div class="col-8 titulocard flex items-center">
          <q-icon name="mdi-account-cash" size="24px" />
          <span class="q-ml-sm">Conciliación bancaria</span>
        </div>
        <div class="col-4 text-right">
          <can permiso="view_menu_contabilidad_procesos_conciliacion_bancaria_acciones_conciliar">
            <q-btn
              round
              dense
              color="orange"
              icon="mdi-account-cash"
              class="q-mr-md"
              @click="onSubmit"
              v-if="tab == 'no_conciliados'"
              :disable="conciliacion_cerrada.estado"
            >
              <q-tooltip>Conciliar</q-tooltip>
            </q-btn>
          </can>
          <q-btn
            round
            dense
            color="green"
            icon="mdi-microsoft-excel"
            class="q-mr-md"
            @click="exportarExcel"
          >
            <q-tooltip>Exportar excel</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            color="amber"
            icon="mdi-printer"
            class="q-mr-md"
            @click="imprimirInforme"
            v-if="tab == 'no_conciliados'"
          >
            <q-tooltip>Imprimir Informe</q-tooltip>
          </q-btn>
          <can permiso="view_menu_contabilidad_procesos_conciliacion_bancaria_acciones_cerrar_conciliacion">
            <q-btn
              round
              dense
              color="red"
              class="q-mr-md"
              @click="cerrarConciliacion"
              v-if="tab == 'no_conciliados'"
              :disable="conciliacion_cerrada.estado"
            >
              <q-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M21.8 15C22.4 15 23 15.6 23 16.3V19.8C23 20.4 22.4 21 21.7 21H16.2C15.6 21 15 20.4 15 19.7V16.2C15 15.6 15.6 15 16.2 15V13.5C16.2 12.1 17.6 11 19 11C20.4 11 21.8 12.1 21.8 13.5V15M20.5 15V13.5C20.5 12.7 19.8 12.2 19 12.2C18.2 12.2 17.5 12.7 17.5 13.5V15H20.5M2 6H20V9.1L19 9C18.18 9 17.41 9.2 16.73 9.54C16.28 9.18 16 8.62 16 8H6C6 9.11 5.11 10 4 10V14C5.11 14 6 14.9 6 16H13.04L13 16.5V18H2V6M11 9C12.66 9 14 10.34 14 12C14 13.66 12.66 15 11 15C9.34 15 8 13.66 8 12C8 10.34 9.34 9 11 9Z"
                  />
                </svg>
              </q-icon>
              <q-tooltip>Cerrar conciliación</q-tooltip>
            </q-btn>
          </can>
          <!-- <q-btn
            round
            dense
            color="orange"
            icon="mdi-cloud-upload"
            class="q-mr-md"
            @click="$refs.upload.pickFiles()"
          >
            <q-tooltip>Importar excel</q-tooltip>
          </q-btn> -->
          <q-btn
            round
            dense
            color="white"
            class="q-mr-sm q-ml-sm"
            :to="{ name: 'home' }"
          >
            <q-icon name="home" color="blue" />
            <q-tooltip>inicio</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="form_conciliacion" class="row">
          <!-- <l-select
            col="md-3 text-black"
            v-model="model.tipo_conciliacion"
            label="Tipo de conciliación *"
            :options="tipo_conciliacion"
            :rules="[$rules.required($t('validator.required'))]"
          /> -->
          <l-select
            col="md-4 text-black"
            v-model="model.cuenta"
            optionLabel="cuenta_nombre"
            label="Cuenta Bancaria *"
            :options="bancos"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <l-select
            col="md-2 text-black"
            v-model="model.mes"
            optionValue="numero"
            optionLabel="nombre"
            label="Mes *"
            :options="meses"
            icon="mdi-calendar"
            :rules="[$rules.required($t('validator.required'))]"
            ref="seletmes"
          />
          <l-select
            col="md-2 text-black"
            v-model="model.anio"
            optionValue="nombre"
            optionLabel="nombre"
            label="Año *"
            :options="anio"
            :rules="[$rules.required($t('validator.required'))]"
          />
          <div class="flex items-center q-ml-md">
            <q-btn
              round
              unelevated
              dense
              color="primary"
              icon="search"
              @click="buscar"
            >
              <q-tooltip>Buscar</q-tooltip>
            </q-btn>
          </div>
        </q-form>
        <div class="q-mt-md">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            style="border: 1px solid lightgray; border-bottom: none"
          >
            <q-tab name="no_conciliados" label="No conciliados" />
            <q-tab name="conciliados" label="Conciliados" />
          </q-tabs>
          <q-separator />
          <q-tab-panels
            v-model="tab"
            animated
            style="border: 1px solid lightgray; border-top: none"
          >
            <q-tab-panel name="no_conciliados">
              <tablanoconciliados
                ref="tablanoconciliados"
                v-model="no_conciliados"
                :in_mes="model.mes"
                :in_anio="model.anio"
                :in_cuenta="model.cuenta"
                :estado="conciliacion_cerrada.estado"
                :cuentas_bancarias="bancos"
              />
            </q-tab-panel>
            <q-tab-panel name="conciliados">
              <tablaconciliados ref="tablaconciliados" v-model="conciliados" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card-section>
    </q-card>
    <q-uploader
      ref="upload"
      :multiple="false"
      @added="handkeFileChange"
      v-show="false"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
    <imprimir ref="imprimir" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import fileDownload from "js-file-download";
import moment from "moment";
import tablanoconciliados from "./tablanoconciliados.vue";
import tablaconciliados from "./tablaconciliados.vue";
import imprimir from "./imprimir.vue";
import { QSpinnerCube } from 'quasar';
export default {
  layout: "main",
  name: "index",
  components: {
    tablanoconciliados,
    tablaconciliados,
    imprimir,
  },
  data() {
    return {
      tab: "no_conciliados",
      pdfs: { path: null },
      model: {
        tipo_conciliacion: 1,
        cuenta: null,
        anio: null,
        mes: null,
      },
      conciliacion_cerrada: {
        estado: false,
        data: [],
      },
      contador: 0,
      bancos: [],
      no_conciliados: [],
      conciliados: [],
      tipo_conciliacion: [
        {
          id: 1,
          nombre: "Conciliación Manual",
        },
        {
          id: 2,
          nombre: "Conciliación por archivo plano",
        },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    async onSubmit() {
      let data = [];
      if (this.tab == "no_conciliados") {
        data = this.no_conciliados.filter((f) => f.select == true);
      } else {
        data = this.conciliados.filter((f) => f.select == true);
      }
      if (data.length == 0) {
        this.LInfo("warning", "Por favor seleccione el menos un registro.");
        return;
      }
      this.LConfim(
        "¿Está seguro de realizar el proceso de conciliación bancaria?",
        async () => {
          this.contador = 1;
          this.$q.loading.show({
            spinner: QSpinnerCube,
            spinnerColor: "blue-5",
            message: `Procesando ${this.contador} de ${data.length}. Por favor espere ...`,
          });
          setTimeout(async () => {
            let validate = true;
            let element = document.querySelector("div.q-loading").children[1];
            for (let i = 0; i < data.length; i++) {
              element.textContent = `Procesando ${this.contador} de ${data.length}. Por favor espere ...`;
              if (validate) {
                let params = {
                  data: [data[i]],
                  filtros: this.model,
                };
                await fetch(
                  "api/contabilidad/conciliacion_bancaria/conciliar/",
                  {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Token ${this.$store.state.auth.token}`,
                    },
                  }
                )
                  .then((res) => res.json())
                  .catch((error) => {
                    if (data.length == 1) {
                      this.$q.loading.hide();
                      this.LConfimOK(
                        "warning",
                        "Se presentó un error en el proceso, por favor comuníquese con soporte.",
                        () => {
                          this.buscar();
                        },
                        false
                      );
                    } else {
                      validate = false;
                    }
                  })
                  .then((response) => {
                    if (response.status == 200) {
                      this.contador += 1;
                      if (data.length + 1 == this.contador) {
                        this.$q.loading.hide();
                        this.LConfimOK(
                          "success",
                          `Conciliación bancaria realizada correctamente.`,
                          () => {
                            this.buscar();
                          },
                          false
                        );
                      }
                    } else {
                      if (data.length == 1) {
                        this.$q.loading.hide();
                        this.LConfimOK(
                          "warning",
                          response.msg,
                          () => {
                            this.buscar();
                          },
                          false
                        );
                      } else {
                        validate = false;
                      }
                    }
                  });
              } else {
                this.$q.loading.hide();
                this.LConfimOK(
                  "warning",
                  "Se presentó un error en el proceso, por favor comuníquese con soporte.",
                  () => {
                    this.buscar();
                  },
                  false
                );
              }
            }
          }, 1000);
        },
        () => {}
      );
    },
    async cerrarConciliacion() {
      const validate = await this.$refs.form_conciliacion.validate();
      if (validate) {
        this.LConfim(
          `¿Está seguro de cerrar la conciliación bancaria de la cuenta ${
            this.bancos.find((f) => f.id == this.model.cuenta).cuenta_nombre
          } del ${this.model.mes}/${this.model.anio}`,
          async () => {
            let params = { ...this.model };
            params["valor_extracto"] =
              this.$refs.tablanoconciliados.searchValorExtracto();
            await this.Post(
              "contabilidad/conciliacion_bancaria/cerrar_conciliacion",
              params
            ).then((resp) => {
              if (resp.status == 200) {
                this.LConfimOK("success", resp.msg, () => {
                  this.buscar();
                }, false);
              } else {
                this.LInfo("warning", resp.msg);
              }
            });
          },
          () => {}
        );
      }
    },
    async imprimirInforme() {
      const validate = await this.$refs.form_conciliacion.validate();
      if (validate) {
        let valor_extracto =
          this.$refs.tablanoconciliados.searchValorExtracto();
        this.model["valor_extracto"] = valor_extracto;
        let params = {
          filtros: this.model,
        };
        await this.Post(
          "contabilidad/conciliacion_bancaria/informe",
          params
        ).then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimir.abrirmodal(this.pdfs);
        });
      }
    },
    async exportarExcel() {
      const validate = await this.$refs.form_conciliacion.validate();
      if (validate) {
        this.model["tab"] = this.tab;
        await this.PostDownload(
          "contabilidad/conciliacion_bancaria/exportar",
          this.model
        ).then((resp) => {
          fileDownload(
            resp,
            `movimientos_${
              this.tab == "no_conciliados" ? "por_conciliar" : "conciliados"
            }.xlsx`
          );
        });
      }
    },
    handkeFileChange(e) {
      this.view_excel = false;
      this.data = [];
      this.rawFile = null;
      this.rawFile = e[0];
      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          let xlsxArr = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { header: 0, defval: null }
          );
          this.workbook = workbook;
          this.xlsxArrToTableArr(xlsxArr);
        })
        .catch((err) => {
          console.error(err);
        });
      this.$refs.upload.reset();
    },
    async buscar() {
      const validate = await this.$refs.form_conciliacion.validate();
      if (validate) {
        await this.Get("contabilidad/conciliacion_bancaria", this.model).then(
          (resp) => {
            this.no_conciliados = resp.no_conciliados;
            this.conciliados = resp.conciliados;
            this.conciliacion_cerrada = {
              estado: resp.conciliacion_cerrada.estado,
              data: JSON.parse(resp.conciliacion_cerrada.data),
            };
            if (this.conciliacion_cerrada.estado == true) {
              this.no_conciliados = [...this.conciliacion_cerrada.data];
              this.LInfo(
                "warning",
                `Conciliación cerrada para la cuenta ${
                  this.bancos.find((f) => f.id == this.model.cuenta)
                    .cuenta_nombre
                } del ${this.model.mes}/${this.model.anio}`
              );
            }
          }
        );
      }
    },
    async getCuentasBancarias() {
      await this.Get("contabilidad/ctabanco").then((resp) => {
        this.bancos = resp;
      });
    },
  },
  watch: {
    tab(val) {
      setTimeout(() => {
        if (val == "no_conciliados") {
          if (this.model.tipo_conciliacion == 1) {
            this.$refs.tablanoconciliados.getTotales();
            this.$refs.tablanoconciliados.getValorExtracto();
          } else {
            this.$refs.tablaconciliados.getTotales();
          }
        } else {
          if (this.model.tipo_conciliacion == 1) {
            this.$refs.tablaconciliados.getTotales();
          }
        }
      }, 500);
    },
    model: {
      deep: true,
      handler() {
        if (this.model.tipo_conciliacion != null && this.model.cuenta != null && this.model.anio != null && this.model.mes != null) {
          this.buscar();
        }
      },
    },
  },
  created() {
    this.getCuentasBancarias();
    this.getConfAnio().then(() => {
      this.model.anio = this.anio.filter(
        (f) => f.nombre == parseInt(moment().format("YYYY"))
      )[0].nombre;
    });
    this.getConfMes().then(() => {
      this.model.mes = this.meses.filter(
        (f) => f.numero == moment().format("MM")
      )[0].numero;
    });
  },
};
</script>

<style>
</style>