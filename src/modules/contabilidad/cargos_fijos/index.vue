<template>
  <q-page class="q-ma-lg q-ml-lg">
    <q-card flat>
      <q-form class="row q-col-gutter-md" ref="formconsulta">
        <div class="flex items-center col-9">
          <div>
            <l-input
              label="Dia pago"
              type="number"
              v-model="diapago"
              :rules="[(val) => val <= 31 ]"
            />
          </div>
          <div class="flex items-center q-mb-md">
            <q-btn unelevated dense round color="primary" icon="search" @click="getLoad()">
              <q-tooltip>Buscar</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="col-3 q-mb-md flex items-center justify-end">
          <div class="row full-width q-col-gutter-x-sm">
            <can permiso="view_menu_contabilidad_acciones_cargos_fijos_generar" class="col-12 flex justify-end q-pr-sm">
              <q-btn
                round
                dense
                unelevated
                style="border: solid 1px #42a5f5"
                @click="abrirModal()"
              >
                <q-icon name="mdi-file-check" style="color: #42a5f5" />
                <q-tooltip>Facturar</q-tooltip>
              </q-btn>
            </can>
          </div>
        </div>
      </q-form>
      <div class="row">
        <div>
          <q-tabs v-model="tab" align="justify" dense style="border-bottom: 1px solid #d8d8d8">
            <q-tab :name="1" label="Activos" @click="onResetTab()" />
            <q-tab :name="2" label="Inactivos" @click="onResetTab()" />
          </q-tabs>
        </div>
        <q-space class="espacio" />
        <div class="flex justify-end q-ml-md" style="height: 70px">
          <l-input col="3" v-model="filter" placeholder="Búsqueda" />
        </div>
        <q-tab-panels v-model="tab" animated class="col-12">
          <q-tab-panel :name="1"  class="q-pa-none" >
            <q-table
              flat
              bordered
              row-key="name"
              :data="dataCargos"
              :columns="columns"
              :filter="filter"
              :pagination.sync="pagination"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th>
                    <q-checkbox v-model="selectall" color="amber" />
                  </q-th>
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th>
                    <q-btn
                      flat
                      dense
                      color="blue-grey-1"
                      text-color="black"
                      @click="expandir(props,1)"
                    >
                      <q-icon
                        style="font-size: 25px"
                        class="text-white"
                        :name="expande_all ? 'mdi-collapse-all' : 'mdi-expand-all'"
                      />
                      <q-tooltip>{{ expande_all ? "Recoger" : "Expandir" }}</q-tooltip>
                    </q-btn>
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props2">
                <q-tr>
                  <q-td auto-width class="text-center">
                    <q-checkbox v-model="props2.row.select" @input="validarSelectProp($event, [props2.row])" />
                  </q-td>
                  <q-td auto-width>{{ props2.row.documento }}</q-td>
                  <q-td auto-width>{{ props2.row.n_completo }}</q-td>
                  <q-td auto-width>
                    {{ validateNumCouta(props2.row) }}
                  </q-td>
                  <q-td auto-width class="text-center">
                    <q-btn
                      unelevated
                      dense
                      @click="expandir(props2.row, 2)"
                      :icon="props2.row.seleccionado || expande_all == true  ? 'remove' : 'add'"
                    >
                      <q-tooltip>Ver Cargos Fijos</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
                <q-tr
                  v-show="expande_all == false ? props2.row.seleccionado : expande_all"
                  :props="props2"
                >
                  <q-td colspan="9">
                    <div class="q-py-md">
                      <q-table
                        dense
                        :data="props2.row.cargos_detalle"
                        :columns="columnsCargos"
                        :hide-bottom="true"
                        :rows-per-page-options="[0]"
                        flat
                        bordered
                      >
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >{{ col.label }}</q-th>
                            <q-th>
                              <q-btn
                                unelevated
                                dense
                                @click="expandir(props,3)"
                              >
                                <q-icon
                                  :name="expande_all_det ? 'mdi-collapse-all' : 'mdi-expand-all'"
                                />
                                <q-tooltip>{{ expande_all_det ? "Recoger" : "Expandir" }}</q-tooltip>
                              </q-btn>
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr>
                            <q-td auto-width>{{ props.row.concepto }}</q-td>
                            <q-td auto-width>{{ props.row.detalle }}</q-td>
                            <q-td auto-width>{{ formatMoney(props.row.valor) }}</q-td>
                            <q-td auto-width>{{ props.row.diapago }}</q-td>
                            <q-td auto-width>{{ props.row.nrocutas }}</q-td>
                            <q-td auto-width>{{ props.row.totalcuotas }}</q-td>
                            <q-td auto-width>{{ props.row.inmueble_id }}</q-td>
                            <q-td auto-width class="text-center">
                              <q-btn
                                class="q-my-sm"
                                unelevated
                                dense
                                @click="expandir(props.row, 4)"
                                :icon="props.row.sel || expande_all_det == true  ? 'remove' : 'add'"
                              >
                                <q-tooltip>Ver Detalle</q-tooltip>
                              </q-btn>
                            </q-td>
                          </q-tr>
                          <q-tr
                            v-show="expande_all_det == false ? props.row.sel : expande_all_det"
                            :props="props"
                          >
                            <q-td colspan="9">
                              <div class="q-pa-md">
                                <q-table
                                  dense
                                  :data="props.row.concepto_detallado"
                                  :columns="columnsCargosDet"
                                  flat
                                  bordered
                                >
                                  <template v-slot:header="propps">
                                    <q-tr :props="propps">
                                      <q-th>
                                        <q-checkbox
                                          @input="onSelect(props.row.concepto_detallado,props.rowIndex, props2.rowIndex, props.row.allSelection)"
                                          v-model="props.row.allSelection"
                                          :disable="selectall ||props2.row.select"
                                        />
                                      </q-th>
                                      <q-th
                                        v-for="col in propps.cols"
                                        :key="col.name"
                                        :props="propps"
                                      >{{ col.label }}</q-th>
                                    </q-tr>
                                  </template>
                                  <template v-slot:body="props1">
                                    <q-tr :class="props1.row.numero_doc ? 'bg-blue-1' : ''">
                                      <q-td auto-width align="center">
                                        <q-checkbox
                                          v-model="props.row.seleccionar"
                                          v-if="!props1.row.numero_doc"
                                          :val="props1.row.id"
                                          @input="validarCuota(props1.row.id, props.row.seleccionar, props.row.concepto_detallado)"
                                          :disable="selectall || props2.row.select"
                                        />
                                      </q-td>
                                      <q-td auto-width align="left">{{ props1.row.cuota_numero }}</q-td>
                                      <q-td
                                        auto-width
                                        align="left"
                                      >{{ formatMoney(props1.row.valor_cuota) }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.fecha_pago }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.numero_doc }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.username }}</q-td>
                                      <q-td auto-width align="left">
                                        <div class="text-center" v-if="props1.row.info_doc != null">
                                          <q-icon class="cursor-pointer qiconbtn" size="sm" name="mdi-eye" @click="verDocumento(props1.row.info_doc)">
                                            <q-tooltip>Ver documento</q-tooltip>
                                          </q-icon>
                                        </div>
                                      </q-td>
                                    </q-tr>
                                  </template>
                                </q-table>
                              </div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
        <q-tab-panels v-model="tab" animated class="col-12">
          <q-tab-panel :name="2"  class="q-pa-none" >
            <q-table
              flat
              bordered
              row-key="name"
              :data="dataCargos"
              :columns="columns"
              :filter="filter"
              :pagination.sync="pagination"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th>
                    <q-btn
                      flat
                      dense
                      color="blue-grey-1"
                      text-color="black"
                      @click="expandir(props,1)"
                    >
                      <q-icon
                        style="font-size: 25px"
                        class="text-white"
                        :name="expande_all ? 'mdi-collapse-all' : 'mdi-expand-all'"
                      />
                      <q-tooltip>{{ expande_all ? "Recoger" : "Expandir" }}</q-tooltip>
                    </q-btn>
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props2">
                <q-tr>
                  <q-td auto-width>{{ props2.row.documento }}</q-td>
                  <q-td auto-width>{{ props2.row.n_completo }}</q-td>
                  <q-td auto-width class="text-center">
                    <q-btn
                      size="sm"
                      color="primary"
                      round
                      dense
                      @click="expandir(props2.row, 2)"
                      :icon="props2.row.seleccionado || expande_all == true  ? 'remove' : 'add'"
                    >
                      <q-tooltip>Ver Cargos Fijos</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
                <q-tr
                  v-show="expande_all == false ? props2.row.seleccionado : expande_all"
                  :props="props2"
                >
                  <q-td colspan="9">
                    <div class="q-pa-md">
                      <q-table
                        dense
                        :data="props2.row.cargos_detalle"
                        :columns="columnsCargos"
                        :hide-bottom="true"
                        :rows-per-page-options="[0]"
                        flat
                        bordered
                      >
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >{{ col.label }}</q-th>
                            <q-th>
                              <q-btn
                                flat
                                dense
                                color="blue-grey-1"
                                text-color="black"
                                @click="expandir(props,3)"
                              >
                                <q-icon
                                  style="font-size: 25px"
                                  class="text-white"
                                  :name="expande_all_det ? 'mdi-collapse-all' : 'mdi-expand-all'"
                                />
                                <q-tooltip>{{ expande_all_det ? "Recoger" : "Expandir" }}</q-tooltip>
                              </q-btn>
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr>
                            <q-td auto-width>{{ props.row.concepto }}</q-td>
                            <q-td auto-width>{{ props.row.detalle }}</q-td>
                            <q-td auto-width>{{ formatMoney(props.row.valor) }}</q-td>
                            <q-td auto-width>{{ props.row.diapago }}</q-td>
                            <q-td auto-width>{{ props.row.nrocutas }}</q-td>
                            <q-td auto-width>{{ props.row.totalcuotas }}</q-td>
                            <q-td auto-width>{{ props.row.inmueble_id }}</q-td>
                            <q-td auto-width class="text-center">
                              <q-btn
                                size="sm"
                                color="primary"
                                round
                                dense
                                @click="expandir(props.row, 4)"
                                :icon="props.row.sel || expande_all_det == true  ? 'remove' : 'add'"
                              >
                                <q-tooltip>Ver Detalle</q-tooltip>
                              </q-btn>
                            </q-td>
                          </q-tr>
                          <q-tr
                            v-show="expande_all_det == false ? props.row.sel : expande_all_det"
                            :props="props"
                          >
                            <q-td colspan="9">
                              <div class="q-pa-md">
                                <q-table
                                  dense
                                  :data="props.row.concepto_detallado"
                                  :columns="columnsCargosDet"
                                  flat
                                  bordered
                                >
                                  <template v-slot:header="propps">
                                    <q-tr :props="propps">
                                      <q-th
                                        v-for="col in propps.cols"
                                        :key="col.name"
                                        :props="propps"
                                      >{{ col.label }}</q-th>
                                    </q-tr>
                                  </template>
                                  <template v-slot:body="props1">
                                    <q-tr :class="props1.row.numero_doc ? 'bg-blue-1' : ''">
                                      <q-td auto-width align="left">{{ props1.row.cuota_numero }}</q-td>
                                      <q-td
                                        auto-width
                                        align="left"
                                      >{{ formatMoney(props1.row.valor_cuota) }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.fecha_pago }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.numero_doc }}</q-td>
                                      <q-td auto-width align="left">{{ props1.row.username }}</q-td>
                                    </q-tr>
                                  </template>
                                </q-table>
                              </div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <modalpago ref="modalCargosFijos" @refresh="getLoad" @resetCheck="deseleccionarTodo" />
      <verdocumentos ref="verdocumentos" />
    </q-card>
  </q-page>
</template>

<script>
import moment from "moment";
import modalpago from "pages/contabilidad/cargos_fijos/partial/modalpago.vue";
import verdocumentos from "pages/contabilidad/procesos/documentos/partial/crear.vue";
export default {
  components: { modalpago, verdocumentos },
  layout: "main",
  name: "CargosFijos",
  data() {
    return {
      diapago: null,
      seleccionar: [],
      dataCargos: [],
      ataCargosInactivos: [],
      expande_all: false,
      expande_all_det: false,
      model: {},
      filter: null,
      tab: 1,
      data: [],
      columns: [
        {
          name: "documento",
          label: "Documento",
          align: "left",
          field: "documento"
        },
        {
          name: "n_completo",
          align: "left",
          label: "Nombre Completo",
          field: "n_completo"
        },
        {
          name: "num_cuota",
          align: "left",
          label: "# Cuota",
        }
      ],
      columnsCargos: [
        {
          name: "concepto",
          align: "left",
          label: "Concepto",
          field: "concepto"
        },
        { name: "detalle", label: "Detalle", align: "left", field: "detalle" },
        { name: "valor", align: "left", label: "Valor", field: "valor" },
        { name: "diapago", align: "left", label: "Dia pago", field: "diapago" },
        {
          name: "nrocutas",
          align: "left",
          label: "N° Cuotas",
          field: "nrocutas"
        },
        {
          name: "totalcuotas",
          align: "left",
          label: "Total Cuotas",
          field: "totalcuotas"
        },
        {
          name: "inmueble",
          align: "left",
          label: "Inmueble",
          field: "inmueble"
        }
      ],
      columnsCargosDet: [
        {
          name: "cuota_numero",
          label: "Cuota N°",
          align: "left",
          field: "cuota_numero"
        },
        {
          name: "valor_cuota",
          align: "left",
          label: "Valor Cuota",
          field: "valor_cuota"
        },
        {
          name: "fecha_pago",
          align: "left",
          label: "Fecha Pago",
          field: "fecha_pago"
        },
        {
          name: "numero_doc",
          align: "left",
          label: "Documento",
          field: "numero_doc"
        },
        { name: "username", align: "left", label: "Usuario", field: "username" },
        { name: "acciones", align: "center", label: "Acciones" },
      ],
      pagination: { rowsPerPage: 10 }
    };
  },
  computed: {
    selectall: {
      get() {
        if (this.dataCargos.length == 0) {
          return false;
        }
        return this.dataCargos.every(x => x.select);
      },
      set(value) {
        this.validarSelectProp(value, this.dataCargos);
      }
    }
  },
  methods: {
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
    formatFecha(fecha) {
      if (fecha != null) {
        return moment(fecha).format("DD/MM/YYYY");
      }
    },
    onSelect(props, indexHijo, indexPadre, allSelection) {
      if (allSelection) {
        this.dataCargos[indexPadre].cargos_detalle[indexHijo].seleccionar = [
          ...new Set(props.filter(x => !x.numero_doc).map(item => item.id))
        ];
      } else {
        this.dataCargos[indexPadre].cargos_detalle[indexHijo].seleccionar = [];
      }
    },
    onResetTab() {
      if (this.tab) this.dataCargos = [];
    },
    deseleccionarTodo() {
      this.dataCargos.forEach(element => {
        element.cargos_detalle.forEach(item => {
          item.seleccionar = [];
        });
      });
    },
    async getLoad() {
      let diaPago = 0;
      if (
        (this.diapago !== null && this.diapago !== "" && this.diapago <= 0) ||
        this.diapago > 31
      ) {
        this.LInfo(
          "warning",
          "Ingrese un día de pago valido para iniciar la busqueda."
        );
        this.dataCargos = [];
        return;
      }
      if (this.diapago) diaPago = this.diapago
      await this.Get(`contabilidad/cargos_fijos/listar_cargos_fijos/${diaPago}/${this.tab}`).then((response) => {
        this.dataCargos = response
      })
    },
    expandir(expanderBool, param) {
      switch (param) {
        case 1:
          // eslint-disable-next-line no-case-declarations
          const selection = this.dataCargos.some(x => x.seleccionado);
          this.dataCargos.forEach(element => {
            element.seleccionado = !selection;
          });
          expanderBool.expand = !expanderBool.expand;
          break;
        case 2:
          this.expande_all = false;
          expanderBool.seleccionado = !expanderBool.seleccionado;
          break;
        case 3:
          this.dataCargos.forEach(element => {
            const sel = element.cargos_detalle.some(g => g.sel);
            element.cargos_detalle.forEach(item => {
              item.sel = !sel;
            });
          });
          this.expande_all_det = !this.expande_all_det;
          break;
        case 4:
          expanderBool.sel = !expanderBool.sel;
          break;
        default:
          break;
      }
    },
    abrirModal() {
      const arrayT = this.dataCargos.flatMap(registro =>
        registro.cargos_detalle.flatMap(cargo =>
          cargo.concepto_detallado
            .filter(detallado => cargo.seleccionar.includes(detallado.id))
            .map(detallado => ({
              idPersona: registro.id,
              n_completo: registro.n_completo,
              documento: registro.documento,
              detalle: cargo.detalle,
              beneficiario_id: cargo.beneficiario_id,
              concepto_id: cargo.concepto_id,
              mayor_id: cargo.mayor_id,
              persona_id: cargo.persona_id,
              inmueble_id: cargo.inmueble_id,
              total_cuotas: cargo.nrocutas,
              direccion_inm: cargo.direccion_inm,
              centro_costos_id: cargo.centro_costos_id,
              ...detallado
            }))
        )
      );
      if (!arrayT.length > 0) {
        this.LInfo("warning", "No ha seleccionado ningún registro.");
        return;
      }
      this.$refs.modalCargosFijos.openModal(arrayT);
    },
    verDocumento(doc) {
      this.$refs.verdocumentos.abrirmodal(doc.numero, doc.fuente, doc.id, false);
    },
    validarCuota(id, seleccionados, cuotas) {
      let validate = true;
      let array = cuotas.filter((f) => f.numero_doc == null);
      let index = cuotas.findIndex(x => x.id == id);
      let i = seleccionados.findIndex(x => x == id);
      if (i != -1) {
        // Se selecciona del listado a pagar
        for (let i = 0; i < array.length; i++) {
          if (array[i].cuota_numero < cuotas[index].cuota_numero) {
            if (!seleccionados.includes(array[i].id)) {
              validate = false;
              break;
            }
          }
        }
        if (!validate) {
          this.LInfo("warning", "Debe seleccionar las cuotas anteriores.");
          if (i != -1) {
            seleccionados.splice(i, 1);
          }
        }
      } else {
        // Se deselecciona del listado a pagar
        for (let i = 0; i < array.length; i++) {
          if (array[i].cuota_numero > cuotas[index].cuota_numero) {
            if (seleccionados.includes(array[i].id)) {
              validate = false;
              break;
            }
          }
        }
        if (!validate) {
          this.LInfo("warning", "No se puede desmarcar, hay cuotas seleccionadas posteriores a esta.");
          seleccionados.push(id);
        }
      }
    },
    validarSelectProp(value, array) {
      array.forEach((item) => {
        item.cargos_detalle.forEach(cc => {
          cc.seleccionar = [];
          let couta = cc.concepto_detallado.filter(x => x.numero_doc == null);
          if (couta.length > 0) {
            cc.seleccionar = value ? [couta[0].id] : [];
          }
        });
        item.select = value;
      });
    },
    validateNumCouta(row) {
      let num_cuota = 0;
      if (row.cargos_detalle.length == 1) {
        let cuota = row.cargos_detalle[0].concepto_detallado.filter((f) => f.numero_doc == null);
        if (cuota.length > 0) {
          num_cuota = cuota[0].cuota_numero;
        }
        return num_cuota;
      } else {
        return null;
      }
    }
  }
};
</script>
<style lang="scss">
.espacio {
  border-bottom: 1px solid;
  margin-bottom: 33px;
  border-color: #d8d8d8;
}

.q-tab__label {
  font-size: 16px;
}

.q-tab--active {
  & .q-tab__label {
    color: #194880;
    font-weight: bold;
  }
}

.qiconbtn {
  color: grey;
  &:hover {
    color: #42a5f5 !important;
  }
}
</style>
