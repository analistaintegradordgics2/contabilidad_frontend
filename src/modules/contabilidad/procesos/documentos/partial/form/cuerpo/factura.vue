<template>
  <div>
    <q-form ref="formfactura" style="height: 350px">
      <div class="row" v-if="centavos_contabilidad !== null && centavos_contabilidad !== undefined">
        <div class="col-9">
          <q-table
            class="tabla_factura"
            :data="grid"
            :columns="columns"
            row-key="name"
            flat
            dense
            bordered
            :hide-bottom="true"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
            style="height: 350px; background: white; border: 5px solid #f9f9f9"
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td class="qtd" style="width: 150px">
                  <div class="row" style="width: 150px">
                    <l-select
                      col="12 q-mt-sm"
                      v-model="props.row.concepto_id"
                      option-value="id"
                      option-label="codigo_nombre"
                      :options="conceptos_conta"
                      :rules="[$rules.required($t('validator.required'))]"
                      @selected="asignarDetalle(props.rowIndex, $event)"
                      @keydown="AddRow($event, props.rowIndex)"
                      :class_input="`evitclick ${
                        estado ? 'text-weight-bold text-black' : ''
                      }`"
                      color="green"
                      :readonly="estado"
                    />
                  </div>
                </q-td>
                <q-td class="qtd" style="width: 100px">
                  <div class="row">
                    <l-input
                      @keydown="AddRow($event, props.rowIndex)"
                      v-model="props.row.cantidad"
                      col="12 q-mt-sm inputtextcenter"
                      type="number"
                      color="green"
                      :rules="[(val) => val >= 0]"
                      :readonly="estado"
                      :class_input="`${
                        estado ? 'text-weight-bold text-black' : ''
                      }`"
                    />
                  </div>
                </q-td>
                <q-td class="qtd">
                  <div class="q-px-sm" style="width: 600px">
                    <l-input
                      @keydown="AddRow($event, props.rowIndex)"
                      v-model="props.row.detalle"
                      col="12 q-mt-sm"
                      type="textarea"
                      rows="1"
                      :rules="[$rules.required($t('validator.required'))]"
                      color="green"
                      style_input="font-size: 11px !important"
                      :readonly="estado"
                      :class_input="`${
                        estado ? 'text-weight-bold text-black' : ''
                      }`"
                    />
                  </div>
                </q-td>
                <q-td class="qtd">
                  <div
                    class="row"
                    style="width: 120px"
                    @keydown="AddRow($event)"
                  >
                    <l-money
                      v-model="props.row.iva"
                      col="12 q-mt-sm"
                      prefijo=""
                      sufijo=" %"
                      :precision="centavos_contabilidad == true ? 2 : 0"
                      @keydown="AddRow($event, props.rowIndex)"
                      :rules="[(val) => val <= 100]"
                      color="green"
                      :readonly="estado"
                      :class_input="`${
                        estado ? 'text-weight-bold text-black' : ''
                      }`"
                    />
                  </div>
                </q-td>
                <q-td class="qtd">
                  <div class="row" @keydown="AddRow($event)">
                    <l-money
                      v-model="props.row.valor"
                      col="12 q-mt-sm"
                      prefijo="$ "
                      sufijo=""
                      :precision="centavos_contabilidad == true ? 2 : 0"
                      @keydown="AddRow($event, props.rowIndex)"
                      :rules="[(val) => val > 0]"
                      color="green"
                      :readonly="estado"
                      :class_input="`${
                        estado ? 'text-weight-bold text-black' : ''
                      }`"
                    />
                  </div>
                </q-td>
                <q-td auto-width class="text-center qtd">
                  <div class="text-center">
                    <q-btn
                      class="q-mr-sm"
                      size="sm"
                      color="primary"
                      round
                      dense
                      unelevated
                      icon="delete"
                      @click="DeleteRow(props.rowIndex)"
                      v-if="grid.length > 1 && !estado"
                      :disable="estado"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                    <q-btn
                      class="q-mr-sm"
                      size="sm"
                      color="primary"
                      round
                      dense
                      unelevated
                      icon="add"
                      @click="AddRow($event, props.rowIndex)"
                      v-if="grid.length - 1 == props.rowIndex && !estado"
                      :disable="estado"
                    >
                      <q-tooltip>Nuevo Registro</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      size="sm"
                      dense
                      color="primary"
                      icon="mdi-eye"
                      v-if="operacion == 'ARRENDATARIO'"
                    >
                      <q-tooltip>Ver Mandantes</q-tooltip>
                      <q-menu content-class="text-white" content-style="background-color: #194880; border-radius: 8px;">
                        <div class="q-my-sm q-mx-md text-weight-bold ">
                          <label >Mandantes</label><br />
                        </div>
                        <q-separator color="white"></q-separator>
                        <q-list style="width: 300px">
                          <q-item v-for="mandante in mandantes.filter(m => m.id === props.row.id)" :key="mandante.id">
                            <q-item-section>
                              <q-item-label><span class="text-weight-bold">Identificación: </span>{{ mandante.Identificacion }}</q-item-label>
                              <!-- <q-item-label></q-item-label> -->
                              <q-item-label><span class="text-weight-bold">Nombre: </span>{{ mandante.Nombre }}</q-item-label>
                              <!-- <q-item-label></q-item-label> -->
                              <q-item-label ><span class="text-weight-bold">Valor: </span>{{ mandante.Valor }}</q-item-label>
                              <!-- <q-item-label></q-item-label> -->
                              <div v-if="mandante.Participacion">
                                <q-item-label><span  class="text-weight-bold">Participacion: </span>{{ mandante.Participacion }}</q-item-label>
                                <!-- <q-item-label></q-item-label> -->
                              </div>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div
          class="col-3 div_retenciones"
          style="border-radius: 5px; border-right: 0px; background: #f9f9f9; border: 5px solid #f9f9f9"
        >
          <div class="row">
            <label class="col-12 q-pt-sm text-center class_retenciones"
              >Retenciones</label
            >
          </div>

          <div class="row">
            <div
              class="col-md-12 flex items-center justify-start q-px-md q-pt-sm"
            >
              <label
                class="text-caption text-weight-bold"
                style="color: #194880"
                >ReteFuente</label
              >
            </div>
            <l-money
              v-model="porcentajes.retefuente"
              col="4 q-mb-xs q-mt-xs"
              prefijo=""
              sufijo=" %"
              :precision="3"
              :rules="[(val) => val <= 100]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-money
              v-model="retenciones.retefuente"
              col="8 q-mb-xs q-mt-xs"
              prefijo="$ "
              sufijo=""
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="true"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <!-- :readonly="estado" -->
          </div>
          <div class="row">
            <div class="col-md-12 flex items-center q-px-md">
              <label
                class="text-caption text-weight-bold"
                style="color: #194880"
                >ReteIVA</label
              >
            </div>
            <l-money
              v-model="porcentajes.reteiva"
              col="4 q-mb-xs q-mt-xs"
              prefijo=""
              sufijo=" %"
              :precision="3"
              :rules="[(val) => val <= 100]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-money
              v-model="retenciones.reteiva"
              col="8 q-mb-xs q-mt-xs"
              prefijo="$ "
              sufijo=""
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="true"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <!-- :readonly="estado" -->
          </div>
          <div class="row">
            <div class="col-md-12 flex items-center q-px-md">
              <label
                class="text-caption text-weight-bold"
                style="color: #194880"
                >ReteICA</label
              >
            </div>
            <l-money
              v-model="porcentajes.reteica"
              col="4 q-mb-xs q-mt-xs"
              prefijo=""
              sufijo=" %"
              :precision="3"
              :rules="[(val) => val <= 100]"
              :readonly="estado"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <l-money
              v-model="retenciones.reteica"
              col="8 q-mb-xs q-mt-xs"
              prefijo="$ "
              sufijo=""
              :precision="centavos_contabilidad == true ? 2 : 0"
              :readonly="true"
              :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
            />
            <!-- :readonly="estado" -->
          </div>
        </div>
      </div>
    </q-form>
    <div class="row q-mt-sm" v-if="centavos_contabilidad !== null && centavos_contabilidad !== undefined">
      <div class="col-12 divtotales q-pa-md" style="height: 110px">
        <div class="row q-mt-lg div_totales">
          <l-money
            v-model="sumatorias.subtotal"
            col="2 q-mb-xs"
            prefijo="$ "
            sufijo=""
            label="Subtotal"
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="porcentajes.descuento"
            col="1 q-mb-xs"
            label="Dscto"
            prefijo=""
            sufijo=" %"
            :precision="2"
            :rules="[(val) => val <= 100]"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="sumatorias.descuento"
            col="2 plnone"
            prefijo="$ "
            sufijo=""
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="sumatorias.total"
            col="2 q-mb-xs"
            prefijo="$ "
            sufijo=""
            label="Total"
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="sumatorias.retenciones"
            col="2 q-mb-xs"
            prefijo="$ "
            sufijo=""
            label="Retenciones"
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="sumatorias.iva"
            col="1 q-mb-xs"
            prefijo="$ "
            sufijo=""
            label="IVA"
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
            :class_input="`${estado ? 'text-weight-bold text-black' : ''}`"
          />
          <l-money
            v-model="sumatorias.grantotal"
            col="2 q-mb-xs grantotal"
            prefijo="$ "
            sufijo=""
            valorMoney="valorMoney"
            tituloinput="Gran Total:"
            class="inputdocu"
            :precision="centavos_contabilidad == true ? 2 : 0"
            :readonly="estado"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "factura",
  props: {
    tipodocumento: {
      type: Number,
      default: 1,
    },
    factura: {
      type: Array,
      default: () => [],
    },
    proporc: {
      type: Object,
      default: () => {},
    },
    estado: {
      type: Boolean,
      default: false,
    },
    tipo_electronica: {
      type: Number,
      default: null,
    },
    id_doc: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      mandantes: [],
      operacion: null,
      retenciones: {
        retefuente: 0,
        reteiva: 0,
        reteica: 0,
      },
      porcentajes: {
        retefuente: 0,
        reteiva: 0,
        reteica: 0,
        descuento: 0,
      },
      sumatorias: {
        subtotal: 0,
        descuento: 0,
        total: 0,
        retenciones: 0,
        iva: 0,
        grantotal: 0,
      },
      sum_total_conceptos_retenciones: 0,
      grid: [
        {
          concepto_id: null,
          cantidad: null,
          detalle: null,
          iva: 0,
          valor: 0,
          valoriva: 0,
          retencion:false,
        },
      ],
      columns: [
        {
          name: "concepto_id",
          label: "Concepto",
          align: "center",
        },
        {
          name: "cantidad",
          label: "Cantidad",
          align: "center",
        },
        {
          name: "detalle",
          label: "Detalle",
          align: "center",
          field: "accion",
        },
        {
          name: "iva",
          label: "Iva %",
          align: "center",
          field: "accion",
        },
        {
          name: "valor",
          label: "Valor",
          align: "center",
          field: "accion",
        },
        {
          name: "accion",
          label: "Acciones",
          align: "center",
          field: "accion",
        },
      ],
      concepto: [],
      pagination: {
        rowsPerPage: 0,
      },
      tmp_factura: []
    };
  },
  computed: {
    ...mapState("contabilidad", ["conceptos_conta"]),
    ...mapState("parametros", ["centavos_contabilidad"]),
  },
  methods: {
    ...mapActions("http", ["Get", "Post"]),
    async onSubmit() {
      try {
        const validate = await this.$refs.formfactura.validate();
        if (validate) {
          this.grid.forEach((item, i) => {
            item.orden = (i + 1);
            let temp = this.tmp_factura.find((f) => item.concepto_id === f.concepto_id);
            if (temp) {
              item.mandantes = temp.mandantes;
            }
          });
          var params = {
            grid: this.grid,
            retenciones: this.retenciones,
            porcentajes: this.porcentajes,
            sumatorias: this.sumatorias,
          };
          return params;
        } else {
          return null;
        }
      } catch ({ message }) {
        console.error(message);
      }
    },
    onReset() {
      this.retenciones = {
        retefuente: 0,
        reteiva: 0,
        reteica: 0,
      };
      this.porcentajes = {
        retefuente: 0,
        reteiva: 0,
        reteica: 0,
        descuento: 0,
      };
      this.sumatorias = {
        subtotal: 0,
        descuento: 0,
        total: 0,
        retenciones: 0,
        iva: 0,
        grantotal: 0,
      };
      this.grid = [
        {
          concepto_id: null,
          cantidad: null,
          detalle: null,
          iva: 0,
          valor: 0,
          valoriva: 0,
          retencion:false,
          orden: null,
          mandantes: null
        },
      ];
      setTimeout(() => {
        this.$refs.formfactura.resetValidation();
      }, 500);
    },
    ejecurtarEventosGrid(tipo, val) {
      switch (tipo) {
      }
    },
    AddRow(event, index = null) {
      if (event.keyCode == 45 || event.type == "click") {
        this.grid.push({
          concepto_id: null,
          cantidad: null,
          detalle: null,
          iva: 0,
          valor: 0,
          retencion:false,
          orden: null,
          mandantes: null
        });
        setTimeout(() => {
          document
            .querySelectorAll("input.evitclick")
            .forEach((element, index) => {
              element.onclick = function (e) {
                if (e.target.value != "") {
                  e.stopPropagation();
                }
              };
            }, 200);
        });
      } else if (event.keyCode == 46) {
        this.DeleteRow(index);
      }
    },
    DeleteRow(index) {
      if (this.grid.length > 1) {
        this.grid.splice(index, 1);
      }
    },
    asignarDetalle(index, model) {
      if (model != null) {
        this.grid[index].detalle = model.detalle;
        this.grid[index].retencion = model.retencion;
        
      }
    },
    notify(tipo, mensaje) {
      this.$q.notify({
        progress: true,
        timeout: 1200,
        type: tipo,
        message: mensaje,
      });
      setTimeout(() => {}, 2000);
    },
    async getConcepto() {
      try {
        const data = await this.Get({ api: "contabilidad/concepto" });
        this.concepto = data;
      } catch ({ message }) {
        console.error(message);
      }
    },
    async getMandantes() {
      try {
        let id_doc = this.id_doc ?? 0;
        const data = await this.Get({ api: `contabilidad/documentos/mandantes/${id_doc}`});
        this.mandantes = data.mandantes;
        this.operacion = data.operacion;
      } catch ({ message }) {
        console.error(message);
      }
    },
    decimaloredondear(valor) {
      if (this.centavos_contabilidad) {
        return parseFloat(parseFloat(valor).toFixed(2));
      } else {
        return parseInt(Math.round(valor));
      }
    }
  },
  watch: {
    grid: {
      handler(val) {
        var subtotal = 0;
        var sumaiva = 0;
        this.sum_total_conceptos_retenciones = 0;
        this.grid.forEach((element, idx) => {
          subtotal = subtotal + element.valor;
          sumaiva = sumaiva + (element.valor * element.iva) / 100;
          if (element.retencion) {
            this.sum_total_conceptos_retenciones += element.valor;
          }
          // Log the full row object for visibility during edits/loads
        });
        // Se comenta para que al generar notas no se eliminen los porcentajes y retenciones - Anghel - Bita 75223 
        // if (this.sum_total_conceptos_retenciones > 0) {
        //   this.porcentajes.retefuente = 0;
        //   this.porcentajes.reteica = 0;
        // }
        this.sumatorias.iva = this.decimaloredondear(sumaiva);
        this.sumatorias.subtotal = this.decimaloredondear(subtotal);
      },
      deep: true,
    },
    id_doc: {
      async handler(val) {
        if (val !== null && val !== undefined) {
          await this.getMandantes();
        }
      },
      immediate: true,
    },
    "sumatorias.subtotal"() {
      this.sumatorias.descuento = 0;
      this.sumatorias.total = 0;
      if (this.porcentajes.descuento != 0 && this.sumatorias.subtotal > 0) {
        this.sumatorias.descuento = this.decimaloredondear((this.sumatorias.subtotal * this.porcentajes.descuento) / 100);
      }
      this.sumatorias.total = this.decimaloredondear(this.sumatorias.subtotal - this.sumatorias.descuento);
    },
    "sumatorias.total"() {
      this.sumatorias.retenciones = this.decimaloredondear(this.retenciones.retefuente + this.retenciones.reteiva + this.retenciones.reteica);
      this.sumatorias.grantotal = this.decimaloredondear(this.sumatorias.total + this.sumatorias.iva);
    },
    "sumatorias.iva"() {
      this.sumatorias.grantotal = this.decimaloredondear(this.sumatorias.total + this.sumatorias.iva);
    },
    "porcentajes.descuento"(val) {
      if (val <= 100) {
        if (this.sumatorias.subtotal > 0) {
          this.sumatorias.descuento = this.decimaloredondear((this.sumatorias.subtotal * this.porcentajes.descuento) / 100);
        }
        this.sumatorias.total = this.decimaloredondear(this.sumatorias.subtotal - this.sumatorias.descuento);
      }
    },
    "porcentajes.retefuente"(val) {
      if (val <= 100 && !this.estado) {
        this.sumatorias.retenciones = 0;
        if (this.sum_total_conceptos_retenciones > 0) {
          this.retenciones.retefuente = this.decimaloredondear((this.sum_total_conceptos_retenciones * this.porcentajes.retefuente) / 100);
        } else {
          this.porcentajes.retefuente = 0;
          this.retenciones.retefuente = 0;
        }
        this.sumatorias.retenciones = this.decimaloredondear(this.retenciones.retefuente + this.retenciones.reteiva + this.retenciones.reteica);
        this.sumatorias.grantotal = this.decimaloredondear(this.sumatorias.total + this.sumatorias.iva);
      }
    },
    "porcentajes.reteiva"(val) {
      if (val <= 100 && !this.estado) {
        this.sumatorias.retenciones = 0;
        if (this.sumatorias.total > 0) {
          this.retenciones.reteiva = this.decimaloredondear((this.sumatorias.iva * this.porcentajes.reteiva) / 100);
        }
        this.sumatorias.retenciones = this.decimaloredondear(this.retenciones.retefuente + this.retenciones.reteiva + this.retenciones.reteica);
        this.sumatorias.grantotal = this.decimaloredondear(this.sumatorias.total + this.sumatorias.iva);
      }
    },
    "porcentajes.reteica"(val) {
      if (val <= 100 && !this.estado) {
        this.sumatorias.retenciones = 0;
        if (this.sum_total_conceptos_retenciones > 0) {
          this.retenciones.reteica = this.decimaloredondear((this.sum_total_conceptos_retenciones * this.porcentajes.reteica) / 100);
        }
        this.sumatorias.retenciones = this.decimaloredondear(this.retenciones.retefuente + this.retenciones.reteiva + this.retenciones.reteica);
        this.sumatorias.grantotal = this.decimaloredondear(this.sumatorias.total + this.sumatorias.iva);
      }
    },
    factura: {
      async handler() {
        this.grid = [];
        this.factura.forEach(item => {
          let porcentaje_iva = 0;
          if (item.piva != undefined) {
            porcentaje_iva = parseFloat(item.piva);
          } else {
            porcentaje_iva = parseFloat(item.iva);
          }
          this.grid.push({
            concepto_id: item.concepto_id,
            cantidad: parseInt(item.cantidad),
            detalle: item.detalle,
            iva: porcentaje_iva,
            valor: item.valor,
            valoriva: ((item.valor * porcentaje_iva) / 100),
            retencion: item.retencion,
            id: item.id,
            mandantes: item.mandantes
          });
        });
        this.tmp_factura = JSON.parse(JSON.stringify(this.factura));
        if (this.id_doc !== null && this.id_doc !== undefined) {
          await this.getMandantes();
        }
      },
      deep: true,
    },
    proporc() {
      this.porcentajes = this.proporc;
      this.retenciones.retefuente = this.proporc.valor_retefuente;
      this.retenciones.reteiva = this.proporc.valor_reteiva;
      this.retenciones.reteica = this.proporc.valor_reteica;
      this.sumatorias.descuento = this.proporc.valor_descuento;
      this.sumatorias.retenciones = this.proporc.valor_retefuente + this.proporc.valor_reteiva + this.proporc.valor_reteica;
    },
  },
  created() {
    this.getConcepto();
    this.getMandantes()
  },
  mounted() {
    this.$nextTick(() => {
      document.querySelectorAll("input.evitclick").forEach((element, index) => {
        element.onclick = function (e) {
          if (e.target.value != "") {
            e.stopPropagation();
          }
        };
      });
    });
  },
};
</script>
<style lang="scss">
.qtd {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.q-field__bottom.row.items-start.q-field__bottom--animated {
  display: none;
}
label.q-input {
  padding-bottom: none;
}
table > thead > tr {
  height: 24px !important;
}
table > tbody > tr {
  background: white;
}
table > tbody > tr > td {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.qinputheigth {
  height: 25px !important;
  margin-bottom: 3px;
}
.qinputheigth div.q-field__control.relative-position.row.no-wrap.bg- {
  height: 23px !important;
}

.qinputheigth div.q-field__control.relative-position.row.no-wrap {
  min-height: 25px !important;
}

.inputheighttd label {
  height: 30px !important;
}

.inputheighttd div.q-field__control.relative-position.row.no-wrap {
  min-height: 30px !important;
}

.inputheighttd
  div.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip {
  height: 30px !important;
}
.inputheighttd input {
  height: 25px !important;
  font-size: 12px;
}

.inputheighttd div.q-field__native.row.items-center {
  min-height: 25px !important;
}
.inputheighttd .q-field__native {
  padding: 0px !important;
}
.inputheighttd .q-field__native.row {
  min-height: 25px !important;
}
.textareaheighttd textarea {
  /* height: 20px !important;  */
  min-height: 20px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.textareaheighttd div.q-field__control.relative-position.row.no-wrap.bg- {
  min-height: 20px !important;
}
.textareaheighttd textarea {
  font-size: 12px;
}
.textareaheighttd div.q-field__marginal {
  height: 26px !important;
}

.inputheighttd input {
  font-size: 12px;
}

.negrita input {
  font-weight: bold !important;
}

.inputtextcenter input {
  text-align: center;
}
.plnone {
  padding-left: 0px !important;
}
.grantotal input {
  color: red;
  font-weight: bold;
}
.class_retenciones {
  height: 48px;
  background: #c4dbf8 0% 0% no-repeat padding-box !important;
  color: #194880;
  opacity: 1;
  font-weight: bold !important;
  border-radius: 4px;
}
.tabla_factura, .div_retenciones, .div_totales {
  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: inset !important;
  }
}
</style>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
