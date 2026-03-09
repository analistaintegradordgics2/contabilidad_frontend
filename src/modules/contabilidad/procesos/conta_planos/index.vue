<template>
  <div class="q-ma-lg">
    <q-card flat>
      <div class="flex justify-end q-px-md">

      <q-space />

      <q-chip class="botones_acciones q-ma-none" size="22px">
        <div class="col-4 text-right">
          <q-btn
            round
            dense
            unelevated
            color="white"
            class=" q-mr-md btnAcciones"
            @click="descargarExcel(1)"
            v-if="!view_excel && this.data.length == 0"
          >
            <q-icon name="mdi-file-download" style="color: #42a5f5" />

            <q-tooltip>Descargar excel de guía</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            unelevated
            color="white"
            class="q-mr-md btnAcciones"
            @click="descargarExcel(2)"
            v-if="view_excel"
          >
            <q-icon name="mdi-file-download" style="color: #42a5f5" />
            <q-tooltip>Descargar excel con inconsistencias</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            unelevated
            color="white"
            class="q-mr-md btnAcciones"
            :disable="
            data.length == 0 || data.filter((f) => f.error == true).length > 0
          "
            @click="onSubmit"
          >
            <q-icon name="calculate" style="color: #42a5f5" />
            <q-tooltip>Contabilizar</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            unelevated
            color="white"
            class="q-mr-md btnAcciones"
            @click="$refs.upload.pickFiles()"
          >
            <q-icon name="mdi-cloud-upload" style="color: #42a5f5" />
            <q-tooltip>Importar excel</q-tooltip>
          </q-btn>
        </div>
      </q-chip>
      </div>
      <q-card-section>
        <q-table
          flat
          bordered
          :data="data"
          :columns="columns"
          row-key="numero_doc"
          :pagination.sync="pagination"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
              <q-th auto-width />
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :class="props.row.error ? 'bg-red-2' : ''">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  dense
                  unelevated
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-tabs
                  v-model="props.row.tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                  style="border: 1px solid lightgray; border-bottom: 0px"
                >
                  <q-tab :name="1" label="Detalle factura" v-if="props.row.factura.length > 0" />
                  <q-tab :name="2" label="Contabilización" />
                </q-tabs>
                <q-separator />
                <q-tab-panels
                  v-model="props.row.tab"
                  animated
                  style="border: 1px solid lightgray; border-top: 0px"
                >
                  <q-tab-panel :name="1" v-if="props.row.factura.length > 0">
                    <q-table
                      dense
                      flat
                      bordered
                      :data="props.row.factura"
                      :columns="columns_factura"
                      row-key="name"
                      :hide-bottom="true"
                      :rows-per-page-options="[0]"
                      :pagination.sync="no_pagination"
                    />
                    <div class="row q-pt-md q-col-gutter-md">
                      <div class="col-2">
                        <div class="text-weight-bold">Rete fuente</div>
                        <q-chip
                          square
                          color="white"
                          text-color="black"
                          class="full-width text-weight-bold q-ma-none"
                          style="border: 1px solid lightgray"
                        >{{ props.row.rte_fuente }} %</q-chip>
                      </div>
                      <div class="col-2">
                        <div class="text-weight-bold">Rete IVA</div>
                        <q-chip
                          square
                          color="white"
                          text-color="black"
                          class="full-width text-weight-bold q-ma-none"
                          style="border: 1px solid lightgray"
                        >{{ props.row.rte_iva }} %</q-chip>
                      </div>
                      <div class="col-2">
                        <div class="text-weight-bold">Rete ICA</div>
                        <q-chip
                          square
                          color="white"
                          text-color="black"
                          class="full-width text-weight-bold q-ma-none"
                          style="border: 1px solid lightgray"
                        >{{ props.row.rte_ica }} %</q-chip>
                      </div>
                      <q-space />
                      <div class="col-3">
                        <div class="text-weight-bold">Total</div>
                        <q-chip
                          square
                          color="white"
                          text-color="black"
                          class="full-width text-weight-bold q-ma-none"
                          style="border: 1px solid lightgray"
                        >{{ formatMoney(props.row.total) }}</q-chip>
                      </div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel :name="2">
                    <q-table
                      dense
                      flat
                      bordered
                      :data="props.row.contabilizacion"
                      :columns="columns_contabilizacion"
                      row-key="name"
                      :hide-bottom="true"
                      :rows-per-page-options="[0]"
                      :pagination.sync="no_pagination"
                    />
                    <div class="row q-gutter-md q-pt-md">
                      <q-space />
                      <div class="col-2">
                        <div class="text-weight-bold">Diferencia</div>
                        <q-chip
                          square
                          color="white"
                          text-color="black"
                          class="full-width text-right text-weight-bold q-ma-none"
                          style="border: 1px solid lightgray"
                        >{{ formatMoney(props.row.diferencia) }}</q-chip>
                      </div>
                      <div class="col-2">
                        <div class="text-weight-bold">Débito</div>
                        <q-chip
                          square
                          color="blue-3"
                          text-color="black"
                          class="full-width text-right text-weight-bold q-ma-none"
                          style="border: 1px solid #64b5f6"
                        >{{ formatMoney(props.row.total_debito) }}</q-chip>
                      </div>
                      <div class="col-2">
                        <div class="text-weight-bold">Crédito</div>
                        <q-chip
                          square
                          color="red-3"
                          text-color="black"
                          class="full-width text-right text-weight-bold q-ma-none"
                          style="border: 1px solid #e57373"
                        >{{ formatMoney(props.row.total_credito) }}</q-chip>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-uploader
      ref="upload"
      :multiple="false"
      @added="handkeFileChange"
      v-show="false"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import fileDownload from "js-file-download";
import { QSpinnerCube } from 'quasar';
export default {
  layout: "main",
  name: "index",
  data() {
    return {
      view_excel: false,
      tab: 1,
      contador: 1,
      file: null,
      rawFile: null,
      workbook: null,
      pagination: {
        rowsPerPage: 10
      },
      no_pagination: {
        rowsPerPage: 0
      },
      tableData: {
        header: [],
        body: [],
        tipo_archivo: ""
      },
      data: [],
      model: [],
      columns: [
        {
          name: "numero_doc",
          label: "Identificador",
          align: "left",
          field: "numero_doc"
        },
        {
          name: "tipo",
          label: "Tipo",
          align: "left",
          field: "tipo_doc"
        },
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha",
          format: val => this.formatFecha(val, 1)
        },
        {
          name: "documento",
          label: "Nit",
          align: "left",
          field: "nit"
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "left",
          field: "detalle"
        },
        {
          name: "forma_pago",
          label: "Forma de Pago",
          align: "left",
          field: "forma_pago"
        },
        {
          name: "total",
          label: "Total",
          align: "right",
          field: "total",
          format: val => this.formatMoney(val)
        },
        {
          name: "diferencia",
          label: "Diferencia",
          align: "right",
          field: "diferencia",
          format: val => this.formatMoney(val)
        }
      ],
      columns_factura: [
        {
          name: "concepto_id",
          label: "Concepto",
          align: "center",
          headerClasses: "bg-green text-white",
          field: "concepto_id"
        },
        {
          name: "cantidad",
          label: "Cantidad",
          align: "center",
          headerClasses: "bg-green text-white",
          field: "cantidad"
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "left",
          headerClasses: "bg-green text-white",
          classes: "white-space",
          style: "max-width: 500px",
          field: "detalle"
        },
        {
          name: "iva",
          label: "Iva",
          align: "center",
          headerClasses: "bg-green text-white",
          field: "iva",
          format: val => `${val}%`
        },
        {
          name: "valor",
          label: "Valor",
          align: "center",
          headerClasses: "bg-green text-white",
          classes: "text-right",
          field: "valor",
          format: val => this.formatMoney(val)
        }
      ],
      columns_contabilizacion: [
        {
          name: "mayor_id",
          label: "Código",
          align: "left",
          field: "mayor_id"
        },
        {
          name: "persona_id",
          label: "Nit",
          align: "left",
          field: "persona_id"
        },
        {
          name: "concepto_id",
          label: "Concepto",
          align: "center",
          field: "concepto_id"
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "left",
          field: "detalle",
          classes: "white-space",
          style: "max-width: 500px"
        },
        {
          name: "valordb",
          label: "Débito",
          align: "left",
          field: "valordb",
          format: val => this.formatMoney(val),
          classes: "text-right"
        },
        {
          name: "valorcr",
          label: "Crédito",
          align: "left",
          field: "valorcr",
          format: val => this.formatMoney(val),
          classes: "text-right"
        },
        {
          name: "docref",
          label: "Doc Ref",
          align: "center",
          field: "docref"
        },
        {
          name: "base",
          label: "Base",
          align: "left",
          field: "base",
          format: val => this.formatMoney(val),
          classes: "text-right"
        },
        {
          name: "cc_id",
          label: "CCosto",
          align: "center",
          field: "cc_id"
        },
        {
          name: "tercero_id",
          label: "Nit Tercero",
          align: "left",
          field: "tercero_id"
        },
        {
          name: "inmu_id",
          label: "Id Inmueble",
          align: "center",
          field: "inmu_id"
        }
      ]
    };
  },
  computed: {},
  methods: {
    // TODO: Convertir fecha -> de numero a fecha
    formatFecha(fecha, tipo) {
      if (tipo == 1) {
        if (fecha != null) {
          let conver_fecha = new Date((fecha - (25567 + 1)) * 86400 * 1000);
          if (moment(conver_fecha).isValid() == true) {
            return moment(conver_fecha).format("YYYY-MM-DD");
          } else {
            return fecha;
          }
        } else {
          return null;
        }
      }
    },
    formatMoney(val) {
      if (val == null) {
        val = 0;
      }
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
      });
      return formatterPeso.format(val);
    },
    async descargarExcel(tipo) {
      let params = {
        data: this.tableData.body,
        tipo: tipo
      };
      await this.PostDownload(
        "contabilidad/contabilizacion_plano/descargar_excel",
        params
      ).then(resp => {
        fileDownload(
          resp,
          `${tipo == 1 ? "plano_guia" : "plano_inconsistente"}.xlsx`
        );
      });
    },
    handkeFileChange(e) {
      this.view_excel = false;
      this.data = [];
      this.rawFile = null;
      this.rawFile = e[0];
      this.fileConvertToWorkbook(this.rawFile)
        .then(workbook => {
          let xlsxArr = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { header: 0, defval: null }
          );
          this.workbook = workbook;
          // this.initTable(this.xlsxArrToTableArr(xlsxArr));
          this.xlsxArrToTableArr(xlsxArr);
        })
        .catch(err => {
          console.error(err);
        });
      this.$refs.upload.reset();
    },
    fileConvertToWorkbook(file) {
      let reader = new FileReader();
      let fixdata = data => {
        let o = "",
          l = 0,
          w = 20240;
        for (; l < data.byteLength / w; ++l) {
          o += String(
            String.fromCharCode.apply(
              null,
              new Uint8Array(data.slice(l * w, l * w + w))
            )
          );
        }
        o += String(
          String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        );
        return o;
      };
      return new Promise((resolve, reject) => {
        try {
          reader.onload = renderEvent => {
            let data = renderEvent.target.result;
            if (this.rABS) {
              /* if binary string, read with type 'binary' */
              resolve(XLSX.read(data, { type: "binary" }));
            } else {
              /* if array buffer, convert to base64 */
              let arr = fixdata(data);
              resolve(XLSX.read(btoa(arr), { type: "base64" }));
            }
          };
          reader.onerror = error => {
            reject(error);
          };
          if (this.rABS) {
            reader.readAsBinaryString(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    async xlsxArrToTableArr(xlsxArr) {
      let tableArr = [];
      let length = 0;
      let maxLength = 0;
      let maxLengthIndex = 0;
      xlsxArr.forEach((item, index) => {
        length = Object.keys(item).length;
        if (maxLength < length) {
          maxLength = length;
          maxLengthIndex = index;
        }
      });
      let tableHeader = Object.keys(xlsxArr[maxLengthIndex]);
      let rowItem = {};
      xlsxArr.forEach(item => {
        rowItem = {};
        tableArr.push(item);
      });
      this.file = this.tableData;
      tableArr.forEach(i => {
        Object.entries(i).forEach(([key, value]) => {
          if (key == "fecha") {
            i.fecha = this.formatFecha(i.fecha, 1);
          }
          if (key == "fecha_vencimiento") {
            i.fecha_vencimiento = this.formatFecha(i.fecha_vencimiento, 1);
          }
          if (key == "fecha_transferencia") {
            i.fecha_transferencia = this.formatFecha(i.fecha_transferencia, 1);
          }
        });
      });
      await this.Post(
        "contabilidad/contabilizacion_plano/validar",
        tableArr
      ).then(resp => {
        if (resp.status == 200) {
          this.view_excel = false;
          this.tableData.body = resp.data;
          this.model = resp.model;
          this.LInfo("success", "Excel sin inconsistencia.");
          this.buildDocumento();
        } else if (resp.status == 400) {
          this.tableData.body = resp.data;
          this.LInfo(
            "warning",
            "El excel tiene inconsistencias, Descargue el excel y por favor revise."
          );
          this.view_excel = true;
          this.buildDocumento();
        } else {
          this.LInfo(
            "warning",
            "Ha ocurrido un problema, por favor comuníquese con soporte."
          );
        }
      });
      // return {
      //   header: tableHeader,
      //   data: tableArr,
      //   tipo: this.tipo_archivo,
      // };
    },
    initTable({ data, header, tipo }) {
      this.tableData.header = header;
      this.tableData.body = data;
      this.tableData.tipo_archivo = tipo;
      // this.buildDocumento();
    },
    buildDocumento() {
      this.data = [];
      let total_debito = 0;
      let total_credito = 0;
      let diferencia = 0;

      this.tableData.body.forEach(i => {
        if (this.data.length > 0) {
          var index = this.data.findIndex(k => k.numero_doc === i.numero_doc);
          if (index >= 0) {
            if (i.seccion.toLowerCase() == "c") {
              total_debito +=
                i.valor_debito != null && i.valor_debito != ""
                  ? parseFloat(i.valor_debito)
                  : 0;
              total_credito +=
                i.valor_credito != null && i.valor_credito != ""
                  ? parseFloat(i.valor_credito)
                  : 0;

              this.data[index].total_debito = total_debito;
              this.data[index].total_credito = total_credito;

              diferencia = total_debito - total_credito;

              if (diferencia < 0) {
                diferencia = Math.abs(diferencia);
              }

              this.data[index]["diferencia"] = diferencia;

              this.data[index].contabilizacion.push({
                mayor_id: i.codigo,
                valordb:
                  i.valor_debito != null && i.valor_debito != ""
                    ? parseFloat(i.valor_debito)
                    : 0,
                valorcr:
                  i.valor_credito != null && i.valor_credito != ""
                    ? parseFloat(i.valor_credito)
                    : 0,
                cc_id: i.cod_ccosto,
                persona_id: i.nit_persona,
                base: i.valor_base,
                docref: i.num_ref,
                tercero_id: i.nit_tercero,
                concepto_id: i.cod_concepto,
                detalle: i.detalle,
                inmu_id: i.id_inmueble,
                pago_id: null
              });
            } else if (i.seccion.toLowerCase() == "f") {
              this.data[index].rte_fuente =
                this.data[index].rte_fuente != null
                  ? this.data[index].rte_fuente
                  : i.porce_rtefuente;
              this.data[index].rte_iva =
                this.data[index].rte_iva != null
                  ? this.data[index].rte_iva
                  : i.porc_rteiva;
              this.data[index].rte_ica =
                this.data[index].rte_ica != null
                  ? this.data[index].rte_ica
                  : i.porc_rteica;

              this.data[index].factura.push({
                concepto_id: i.cod_concepto,
                cantidad: i.cantidad,
                detalle: i.detalle,
                iva: i.porc_iva,
                valor: i.valor,
                valoriva: 0
              });
            }
            this.data[index].tab = this.data[index].factura.length > 0 ? 1 : 2;
            this.data[index].error =
              this.data[index].error == false
                ? this.data[index].rta_observacion != null
                  ? true
                  : false
                : true;
          } else {
            total_debito = 0;
            total_credito = 0;
            diferencia = 0;
            total_debito +=
              i.valor_debito != null && i.valor_debito != ""
                ? parseFloat(i.valor_debito)
                : 0;
            total_credito +=
              i.valor_credito != null && i.valor_credito != ""
                ? parseFloat(i.valor_credito)
                : 0;
            this.data.push(this.primerRegistro(i));
          }
        } else {
          total_debito +=
            i.valor_debito != null && i.valor_debito != ""
              ? parseFloat(i.valor_debito)
              : 0;
          total_credito +=
            i.valor_credito != null && i.valor_credito != ""
              ? parseFloat(i.valor_credito)
              : 0;
          this.data.push(this.primerRegistro(i));
        }
      });
    },
    primerRegistro(model) {
      let contabilizacion = [];
      let factura = [];
      let cheques = [];
      let tarjetas = {
        valor: 0,
        banco: null,
        clase: null,
        numero: null,
        tipo: null
      };
      let consignacion = {
        valor: 0,
        banco: null,
        numero: null,
        fecha: null
      };
      let total_debito = 0;
      let total_credito = 0;
      let diferencia = 0;

      if (model.seccion.toLowerCase() == "c") {
        total_debito =
          model.valor_debito != null && model.valor_debito != ""
            ? parseFloat(model.valor_debito)
            : 0;
        total_credito =
          model.valor_credito != null && model.valor_credito != ""
            ? parseFloat(model.valor_credito)
            : 0;

        diferencia = total_debito - total_credito;

        if (diferencia < 0) {
          diferencia = Math.abs(diferencia);
        }

        contabilizacion.push({
          mayor_id: model.codigo,
          valordb: model.valor_debito,
          valorcr: model.valor_credito,
          cc_id: model.cod_ccosto,
          persona_id: model.nit_persona,
          base: model.valor_base,
          docref: model.num_ref,
          tercero_id: model.nit_tercero,
          concepto_id: model.cod_concepto,
          detalle: model.detalle,
          inmu_id: model.id_inmueble,
          pago_id: null
        });
      } else if (model.seccion.toLowerCase() == "f") {
        factura.push({
          concepto_id: model.cod_concepto,
          cantidad: model.cantidad,
          detalle: model.detalle,
          iva: model.porc_iva,
          valor: model.valor,
          valoriva: 0
        });
      }

      return {
        numero_doc: model.numero_doc,
        tipo_doc: model.tipo_doc_conta,
        fecha: model.fecha,
        nit: model.nit_persona,
        detalle: model.detalle,
        forma_pago: model.forma_pago,
        rte_fuente: model.porce_rtefuente,
        rte_iva: model.porc_rteiva,
        rte_ica: model.porc_rteica,
        total: model.valor_total,
        total_debito: total_debito,
        total_credito: total_credito,
        diferencia: diferencia,
        contabilizacion: contabilizacion,
        factura: factura,
        tab: factura.length > 0 ? 1 : 2,
        error: model.rta_observacion != null ? true : false
      };
    },
    async onSubmit() {
      this.contador = 1;
      this.$q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-5",
        message: `Procesando ${this.contador} de ${this.model.length}. Por favor espere ...`,
      });
      setTimeout(async () => {
        let validate = true;
        let element = document.querySelector("div.q-loading").children[1];
        for (let i = 0; i < this.model.length; i++) {
          element.textContent = `Procesando ${this.contador} de ${this.model.length}. Por favor espere ...`;

          if (validate) {
            await fetch("api/contabilidad/contabilizacion_plano/", {
              method: "POST",
              body: JSON.stringify(this.model[i]),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${this.$store.state.auth.token}`
              }
            })
              .then(res => res.json())
              .catch(error => {
                validate = false;
              })
              .then(response => {
                this.contador += 1;
                if (this.model.length + 1 == this.contador) {
                  this.$q.loading.hide();
                  this.LConfimOK(
                    "success",
                    `Documentos generados correctamente.`,
                    () => {
                      // this.cerrarModal();
                    }
                  );
                  this.data = [];
                }
              });
          } else {
            this.$q.loading.hide();
            this.LInfo(
              "warning",
              "Ha ocurrido un problema, por favor comuníquese con soporte."
            );
          }
        }
      }, 1000);
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.q-table td.white-space {
  white-space: normal !important;
}
.btnAcciones {
  border: 1px solid #42a5f5 !important;
  &:hover {
    color: #194880 !important;
    border: 1px solid #194880 !important;
    & i {
      color: #194880 !important;
    }
  }
}
.botones_acciones {
  border: 1px solid var(---ffffff);
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0%
    0% no-repeat padding-box !important;
}
</style>