<template>
  <q-page class="q-pa-lg">
    <imprimir ref="imprimir" v-model="correos" @value_correo="valuecorreo" @enviar_correo="enviarcorreo" />

    <q-form ref="formcertificados" class="row">
      <l-select col="md-2 text-black" label="Certificado de *" v-model="model.retencion" option-value="id"
        option-label="nombre" :options="retenciones" :rules="[$rules.required($t('validator.required'))]"
        v-if="model.tipo == 'retenciones'" />
      <l-select col="md-2 text-black" label="Mes inicial" v-model="model.mesini" option-value="id" option-label="nombre"
        :options="meses" />
      <l-select col="md-2 text-black" label="Mes final" v-model="model.mesfin" option-value="id" option-label="nombre"
        :options="meses" />

      <l-select class="q-field--float" col="md-2 text-black" v-model="model.anio" option-value="id"
        option-label="nombre" label="Año *" :options="anio" />
      <div class="flex items-center q-gutter-md">
        <q-radio v-model="model.tipo" val="propietario" label="Propietario" />
        <q-radio v-model="model.tipo" val="arrendatario" label="Arrendatario" />
        <q-radio v-model="model.tipo" val="retenciones" label="Retenciones" />
      </div>
      <div class="flex items-center q-ml-md">
        <q-btn unelevated dense rounded color="primary" icon="search" @click="getCertificados()">
          <q-tooltip>Consultar</q-tooltip>
        </q-btn>
      </div>
      <q-space />
      <q-chip class="botones_acciones q-ma-none" size="22px">
        <div class="row q-col-gutter-x-sm">
          <can permiso="view_menu_gestion_contable_consultas_certificados_exportar">
            <q-btn class="btnAcciones" round dense unelevated color="white" @click="acciones(2)"
              :disable="data.filter((filter) => filter.select).length == 0" v-if="model.tipo != 'retenciones'">
              <q-icon name="mdi-microsoft-excel" style="color: #42a5f5" />
              <q-tooltip>Exportar</q-tooltip>
            </q-btn>
          </can>
          <can permiso="view_menu_gestion_contable_consultas_certificados_imprimir">
            <q-btn round dense unelevated color="white" class="btnAcciones" @click="acciones(1)"
              :disable="data.filter((filter) => filter.select).length == 0 || ['movimientos'].includes(tab)">
              <q-icon name="print" style="color: #42a5f5" />
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
          </can>
          <div>
            <q-btn round dense unelevated color="white" class="btnAcciones"
              :disable="data.filter((x) => x.select).length == 0" @click="acciones(3)">
              <q-icon name="archive" style="color: #42a5f5" />
              <q-tooltip>Descargar Zip</q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn round dense unelevated color="white" class="btnAcciones" @click="enviarZonaClientes()"
              v-if="model.tipo == 'propietario'">
              <q-icon name="cloud_upload" style="color: #42a5f5" />
              <q-tooltip>Enviar a zona de clientes</q-tooltip>
            </q-btn>
          </div>
          <can permiso="view_menu_gestion_contable_consultas_certificados_enviar_correo">
            <q-btn round dense unelevated color="white" class="btnAcciones"
              :disable="data.filter((filter) => filter.select).length == 0" @click="enviarcorreo({ val: 4, tipo: 2 })">
              <q-icon name="mail" style="color: #42a5f5" />
              <q-tooltip>Enviar correo a personas seleccionadas</q-tooltip>
            </q-btn>
          </can>
        </div>
      </q-chip>
    </q-form>
    <div>
      <q-tabs v-model="tab" align="justify" dense style="border-bottom: 1px solid #d8d8d8" @input="setTabs">
        <q-tab name="inicio" label="Listado" />
        <q-tab name="conceptos" label="Certificado" :disable="disable" v-if="model.tipo != 'retenciones'">
          <q-tooltip v-if="disable == true">Debe seleccionar solo a una persona</q-tooltip>
        </q-tab>
        <q-tab name="movimientos" label="Movimientos contables" :disable="disable" v-if="model.tipo != 'retenciones'">
          <q-tooltip v-if="disable == true">Debe seleccionar solo a una persona</q-tooltip>
        </q-tab>
        <q-tab name="parametrocta" label="Parametrizar cuentas" v-if="model.tipo == 'retenciones'">
        </q-tab>
      </q-tabs>
    </div>
    <q-space class="espacio" />
    <div class="row" v-if="tab != 'parametrocta'">
      <div class="col-8">
        <q-checkbox v-if="model.tipo == 'retenciones'" v-model="model.descontar_dev" :val="false" right-label
          label="Descontar Devoluciones de RteFte" />


        <q-checkbox v-model="model.cert_por_inm" :val="false" right-label label="Certificado por inmueble"
          v-if="model.tipo == 'propietario'" />
      </div>
      <div v-if="tab == 'inicio'"
        :class="model.tipo == 'retenciones' ? 'col-4 flex justify-end q-pb-md' : 'col-4 flex justify-end q-pb-md'">
        <q-input dense rounded outlined v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-12 q-my-sm">

      <q-tab-panels v-model="tab" animated class="bg-white text-primary">
        <q-tab-panel name="inicio" class="q-pa-none">
          <q-table flat bordered class="tablas" dense :data="data" :columns="columns" :pagination.sync="pagination"
            :filter="filter" row-key="documento">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th>
                  <q-checkbox size="sm" color="amber" v-model="selectall" :val="true" :disable="data.length == 0" />
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                <q-th v-if="model.tipo == 'retenciones'">Acciones</q-th>
                <q-th v-if="model.cert_por_inm && data && 'inmueble' in data[0]">dirección</q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-checkbox size="sm" v-model="props.row.select" :val="true" />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                <q-td v-if="model.cert_por_inm && props.row.inmueble">
                  <div>{{ props.row.inmueble }}</div>
                </q-td>
                <q-td auto-width align="center" v-if="model.tipo == 'retenciones'">
                  <q-btn dense unelevated @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'">
                    <q-tooltip>
                      {{ props.expand ? "Recoger" : "Ver retenciones" }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="6">
                  <div class="q-pa-sm">
                    <q-table dense :data="props.row.mov" :columns="retencionescolumns" :hide-bottom="true"
                      :pagination.sync="paginationRetenciones" flat bordered>
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                            col.label
                          }}</q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr>
                          <!-- <q-td>{{ props.row.fecha }}</q-td> -->
                          <q-td>{{ props.row.codigo }}</q-td>
                          <!-- <q-td>{{ props.row.documento }}</q-td> -->
                          <!-- <q-td>{{ props.row.concepto }}</q-td> -->
                          <q-td>{{ props.row.nombre_cuenta }}</q-td>
                          <!-- <q-td>{{ formatMoney(props.row.debito) }}</q-td> -->
                          <q-td>{{ props.row.porretencion }}%</q-td>
                          <q-td>{{ formatMoney(props.row.base) }}</q-td>
                          <q-td>{{ formatMoney(props.row.valor_retenido) }}</q-td>
                        </q-tr>
                      </template>
                      <template v-slot:bottom-row>
                        <q-tr>
                          <q-td colspan="2"></q-td>
                          <q-td>
                            <strong>TOTAL RETENCIONES</strong>
                          </q-td>
                          <q-td> </q-td>
                          <q-td>
                            <strong>
                              {{ formatMoney(props.row.total_retencion) }}
                            </strong>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </q-td>
              </q-tr>
            </template>
            <template v-slot:no-data>
              <div class="full-width flex justify-center items-center">
                <q-icon size="24px" name="mdi-alert" color="black" />
                <span class="q-ml-xs">Sin Datos Disponibles</span>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="conceptos" class="q-pa-none">
          <conceptos v-model="conceptos" :persona="persona" />
        </q-tab-panel>

        <q-tab-panel name="movimientos">
          <movimientos v-model="movimientos" :tipo_consulta="model.tipo" :persona="persona"
            @filtro-concepto="filtro_concepto" />
        </q-tab-panel>
        <q-tab-panel name="parametrocta">
          <q-form ref="formctas" class="col-12 flex column ">
            <div class="row justify-end">
              <q-btn round dense color="primary" class="q-mr-sm" @click="guardarCuentas()">
                <q-icon name="save" color="white" />
                <q-tooltip> Guardar Ctas</q-tooltip>
              </q-btn>
            </div>
            <div class="row q-pt-sm">
              <l-input col="6 text-black" v-model="parametrosctas.cta_rete_fuente" label="CTA RETENCION EN LA FUENTE *"
                type="number" :rules="[
                  (val) => val.length <= 4 || 'máximo cuatro digitos.',
                  $rules.required($t('validator.required')),
                ]" icon="mdi-cog" />
              <l-input col="6 text-black" v-model="parametrosctas.cta_rete_ind_com"
                label="CTA RETENCION INDUSTRIA Y COMERCIO *" type="number" :rules="[
                  (val) => val.length <= 4 || 'máximo cuatro digitos.',
                  $rules.required($t('validator.required')),
                ]" icon="mdi-cog" />
              <l-input col="6 text-black" v-model="parametrosctas.cta_rete_cree" label="CTA RETENCION CREE *"
                type="number" :rules="[$rules.required($t('validator.required'))]" icon="mdi-cog" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";
import conceptos from "./form/conceptos.vue";
import movimientos from "./form/movimientos.vue";
import imprimir from "./form/imprimir";
import fileDownload from "js-file-download";
import moment from "moment";
export default {
  components: {
    conceptos,
    movimientos,
    imprimir
  },
  layout: "main",
  name: "index",
  data() {
    return {
      tab: "inicio",
      pdfs: { path: null },
      model: {
        tipo: "propietario",
        mesini: null,
        mesfin: null,
        anio: null,
        cert_por_inm: false,
        retencion: null,
        descontar_dev: false
      },
      parametrosctas: {
        cta_rete_fuente: null,
        cta_rete_ind_com: null,
        cta_rete_cree: null,
      },
      retenciones: [
        { id: 1, nombre: "Retencion en la fuente" },
        { id: 2, nombre: "Industria y Comercio" },
        { id: 3, nombre: "Autorretención" },
      ],
      conceptos: [],
      movimientos: [],
      tmp_movimientos: [],
      pagination: {
        rowsPerPage: 10
      },
      paginationRetenciones: {
        rowsPerPage: 20,
      },
      persona: "",
      filter: null,
      correos: "",
      data: [],
      dataTemp: [],
      columns: [
        {
          name: "documento",
          label: "Número de documento",
          align: "left",
          field: "documento",
          sortable: true,
          headerStyle: "height: 40px"
        },
        {
          name: "nombre",
          label: "Nombre",
          align: "left",
          field: "nombre",
          sortable: true,
          headerStyle: "height: 40px",
        },

      ],
      retencionescolumns: [
        {
          name: "codigo",
          label: "codigo",
          align: "left",
          field: "codigo",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "nombre_cuenta",
          label: "cuenta",
          align: "left",
          field: "nombre_cuenta",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "porretencion",
          label: "% retención",
          align: "left",
          field: "porretencion",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "base",
          label: "base",
          align: "left",
          field: "base",
          sortable: true,
          headerStyle: "height: 40px",
        },
        {
          name: "valor_retenido",
          label: "Valor Retenido",
          align: "left",
          field: "valor_retenido",
          sortable: true,
          headerStyle: "height: 40px",
        },
      ],
    };
  },
  computed: {
    ...mapState("generales", ["meses", "anio"]),
    selectall: {
      get() {
        if (this.data.length > 0) {
          let result = this.data.filter(filter => filter.select == true);
          if (result.length == this.data.length) {
            return true;
          }
        }
        return false;
      },
      set(value) {
        this.data.forEach(element => {
          element.select = value;
        });
      }
    },
    disable() {
      let result = this.data.filter(filter => filter.select);
      if (result.length == 1) {
        return false;
      }
      return true;
    }
  },
  methods: {
    ...mapActions("generales", ["getConfMes", "getConfAnio"]),
    ...mapActions("contabilidad", ["getList_conceptos_conta"]),

    buildData() {
      let result = this.data.filter((filter) => filter.select == true);
      // if (this.model.tipo === 'propietario' && this.model.cert_por_inm) {
      //   const documentosResult = new Set(result.map(element => element.documento));
      //   result = this.dataTemp.filter(item => documentosResult.has(item.documento));
      // }
      result.forEach((element) => {
        element.conceptos = this.agruparConceptos(element.conceptos);
        let totaldb = 0;
        let totalcr = 0;
        element.conceptos.forEach((item) => {
          totaldb += item.debito;
          totalcr += item.credito;
        });
        element.saldo_inicial_positivo = Math.abs(element.saldoini)
        element["totaldb"] = totaldb;
        element["totalcr"] = totalcr;
        element["totalneto"] =  totalcr - totaldb;
        element["tipo"] = this.model.tipo;
        element['anio'] = this.model.anio
        element['mesini'] = this.model.mesini
        element['mesfin'] = this.model.mesfin
        element['tab']  = this.tab
        element['certificado'] = this.model.retencion
      });
      return result;
    },
    async acciones(tipo, tipoemail = null) {
      if (['', undefined, null].includes(this.model.mesini) || ['', undefined, null].includes(this.model.mesfin)) {
        this.LInfo("warning", "Por favor seleccione un mes inicial y final validos.");
        return
      }
      let result = this.data.filter((filter) => filter.select == true);
      if (this.model.tipo === 'propietario' && !this.model.cert_por_inm) {
        const documentosResult = new Set(result.map(element => element.documento));
        let singleResult = [];
        result.forEach(items => {
          
          let dataresult = this.dataTemp.filter(item => item.documento == items.documento);
          let conceptosAgrupados = {};
          let movimientos = [];
          let nombre = '';
          let documento = '';
          let inmueble = '';
          let saldoini = 0;
          let select = true;
  
          dataresult.forEach((element, index) => {
            // Agrupar los conceptos del elemento
            element.conceptos.forEach(concepto => {
                           
              const creditoAbs = concepto.credito
              if (conceptosAgrupados[concepto.nombre]) {
                conceptosAgrupados[concepto.nombre].debito += concepto.debito;
                conceptosAgrupados[concepto.nombre].credito += creditoAbs;
              } else {                
                conceptosAgrupados[concepto.nombre] = {
                  id: concepto.id,
                  nombre: concepto.nombre,
                  debito: concepto.debito,
                  credito: creditoAbs
                };
              }
            });
            
           
            // Añadir movimientos
            movimientos = movimientos.concat(element.movimientos);
  
            // Capturar el nombre, documento e inmueble del primer elemento
            if (index === 0) {
              nombre = element.nombre;
              documento = element.documento;
              inmueble = element.inmueble;
              saldoini = element.saldoini;
            }
          });
  
          const conceptosUnidos = Object.values(conceptosAgrupados);
  
          let totaldb = conceptosUnidos.reduce((sum, item) => sum + item.debito, 0);
          let totalcr = conceptosUnidos.reduce((sum, item) => sum + Math.abs(item.credito), 0);
  
          const saldoInicialPositivo = dataresult.reduce((acc, element) => acc + Math.abs(element.saldoini), 0);
          const totalNeto = totaldb - totalcr < 0 ? (totaldb - totalcr) * -1 : totaldb - totalcr;

          conceptosUnidos.forEach(element => {
            element.credito = Math.abs(element.credito)
            
          });
          singleResult.push({
            anio: this.model.anio,
            certificado: this.model.retencion,
            conceptos: conceptosUnidos,
            documento: documento,
            inmueble: inmueble,
            mesfin: this.model.mesfin,
            mesini: this.model.mesini,
            movimientos: movimientos,
            nombre: nombre,
            saldo_inicial_positivo: saldoInicialPositivo,
            saldoini: saldoini,
            select: select,
            tab: this.tab,
            tipo: this.model.tipo,
            totalcr: totalcr,
            totaldb: totaldb,
            totalneto: totalNeto
          });
  
        });
        result = singleResult;
      } else {
        result = this.buildData();
      }
      if (tipo == 1) {
        // Imprimir
        await this.Post(
          "contabilidad/consultas/imprimircertificados",
          { datos: result, downloadZip: false }
        ).then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp], { type: "application/pdf" })
          );
          this.pdfs.path = url;
          this.$refs.imprimir.abrirmodal(
            this.pdfs,
            this.model.tipo.toUpperCase(),
            result,
            this.tab
          );
        });
      } else if (tipo == 2) {
        // Exportar
        if (this.tab == 'movimientos') {
          await this.PostDownload("contabilidad/consultas/exportarcertificados_movimientos", result[0].movimientos).then((resp) => {
            fileDownload(resp, "certificados_movimientos.xlsx");
          });
        } else {
          await this.PostDownload(
            "contabilidad/consultas/exportarcertificados",
            result
          ).then(resp => {
            fileDownload(resp, "certificados.xlsx");
          });
        }
      } else if (tipo == 3) {
        await this.PostDownload('contabilidad/consultas/imprimircertificados', { datos: result, downloadZip: true }).then((resp) => {
          const pdf = window.URL.createObjectURL(new Blob([resp], { type: 'application/zip' }))
          window.open(pdf, '_self')
        })
      } else {
        this.LConfim(
          "¿Esta seguro/a?, ¿Desea enviar los certificados correspondientes a los registros seleccionados?",
          async () => {
            await this.Post("contabilidad/consultas/enviarcertificados", {
              correos: this.correos,
              model: result,
              tipo: this.model.tipo,
              tipo_correo: tipoemail
            }).then(resp => {
              if (resp == "OK") {
                this.LInfo("success", "Correo enviado correctamente.");
              }
            });
          });
      }
    },
    async guardarCuentas() {
      const validate = await this.$refs.formctas.validate();
      if (validate) {
        await this.Post("contabilidad/consultas/parametro_ctas", this.parametrosctas).then(resp => {
          if (resp == 'ok') {
            this.LInfo("success", "Parametros Guardados correctamente.");
          }
        })
      }
    },
    enviarcorreo(model) {
      this.acciones(model.val, model.tipo);
    },
    setTabs(val) {

      if (val != "inicio") {


        let result = this.data.filter(filter => filter.select == true)[0];
        let resulcompletos = this.dataTemp.filter(filter => filter.documento == result.documento)
        let temp_conceptos = result.conceptos;
        this.persona = `${result.documento} - ${result.nombre}`;
        if (this.movimientos.length == 0 && this.conceptos.length == 0) {
          // this.movimientos = result.mov;
          // Agrupar conceptos
          if (!this.model.cert_por_inm) {
            let conceptos = []
            let movimientos = []
            resulcompletos.forEach(res => {
              if (Array.isArray(res.conceptos)) {
                movimientos = [...movimientos, ...res.conceptos];
              };
              if (Array.isArray(res.conceptos)) {
                conceptos = [...conceptos, ...res.conceptos];
              }
            })
            this.movimientos = movimientos
            this.tmp_movimientos = this.movimientos;
            this.conceptos = this.agruparConceptos(conceptos);
          } else {
            this.movimientos = result.movimientos;
            this.tmp_movimientos = result.movimientos;
            this.conceptos = this.agruparConceptos(temp_conceptos);
          }
        }
      } else {
        this.movimientos = [];
        this.tmp_movimientos = [];
        this.conceptos = [];
      }
    },
    formatMoney(val) {
      const formatterPeso = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });

      return formatterPeso.format(val);
    },
    agruparConceptos(data) {
      const conceptosAgrupados = {};
      data.forEach(conc => {
        const { id,
          nombre,
          debito,
          credito,
          base,
          codigo,
          fecha,
          documento,
          inmueble,
          concepto,
          detalle
        } = conc;

        if (!conceptosAgrupados[id]) {
          conceptosAgrupados[id] = {
            id: id,
            nombre: nombre,
            debito: debito,
            base: base,
            codigo: codigo,
            credito: credito,
            fecha: fecha,
            documento: documento,
            // inmueble: inmueble,
            inmueble_id: inmueble,
            inmueble: inmueble,
            concepto: concepto,
            detalle: detalle
          };
        } else {
          conceptosAgrupados[id].debito += debito;
          conceptosAgrupados[id].credito += credito;         
          conceptosAgrupados[id].base += base;
        }
      });
      let items = Object.values(conceptosAgrupados)
      items.forEach((element) => {
        element.debito = element.debito < 0 ? (element.debito * -1) : element.debito
        element.credito = element.credito < 0 ? (element.credito * -1) : element.credito
      })

      return items;
    },
    async getCertificados() {
      const validate = await this.$refs.formcertificados.validate();
      if (validate) {

        if (this.model.anio == null) {
          this.LInfo("warning", "Debe seleccionar el año");
          return;
        }
        if (['', null, undefined].includes(this.model.mesini) || ['', null, undefined].includes(this.model.mesfin)) {
          this.LInfo("warning", "Se debe seleccionar un mes inicial y un mes final");
          return
        }
        this.tab = "inicio";
        await this.Post("contabilidad/consultas/certificados", this.model).then(
          (resp) => {
            if (this.model.tipo == 'retenciones') {
              resp.forEach((element) => {
                element.mov = Object.values(element.conceptos.reduce((acumulador, objeto) => {
                  const codigo = objeto.codigo;
                  if (!acumulador[codigo]) {
                    acumulador[codigo] = { ...objeto };
                  } else {
                    acumulador[codigo].valor_retenido += objeto.valor_retenido;
                    acumulador[codigo].base += objeto.base;
                  }
                  return acumulador;
                }, {}));
              })
            } else if (this.model.tipo == 'propietario' && !this.model.cert_por_inm) {
              this.dataTemp = resp
              resp = resp.reduce((acumulador, objeto) => {
                const existe = acumulador.some(item => item.documento === objeto.documento);
                if (!existe) {
                  acumulador.push(objeto);
                }

                return acumulador;
              }, []);
            }
            resp.forEach((el) => {
              el['movimientos'] = el.conceptos
            })
            this.data = resp;
            this.movimientos = [];
            this.conceptos = [];
          }
        );
      }
    },
    valuecorreo(val) {
      this.correos = val;
    },
    async getparametrosctas() {
      await this.Get("contabilidad/consultas/get_parametro_ctas").then(resp => {
        resp.forEach(item => {
          this.parametrosctas[item.parametro] = item.valor;
        });
      })
    },
    filtro_concepto(model) {
      if (model != null) {
        this.movimientos = [...this.tmp_movimientos.filter((f) => f.concepto == model.id)];
      } else {
        this.movimientos = [...this.tmp_movimientos];
      }
    },
    async enviarZonaClientes() {
      let data = this.buildData();
      if (data.length == 0) {
        this.LInfo("warning", "Debe seleccionar al menos un registro");
        return;
      }
      this.LConfim(
        "¿Está seguro de cargar los certificados a la zona de clientes?",
        async () => {
          let resp = await this.Post("contabilidad/consultas/zona_clientes_certificados", data);
          this.LInfo(resp.status == 200 ? 'success' : 'warning', resp.status == 200 ? "Certificados enviados a zona de clientes" : resp.msg);
        }, () => { }
      );
    }
  },
  watch: {
    "model.tipo"(val) {
      this.data = [];
    }
  },
  created() {
    this.getConfMes().then(() => {
      let mes_actual = this.meses.find((f) => f.numero == moment().format("MM"));
      if (mes_actual != null) {
        this.model.mesini = mes_actual.id;
        this.model.mesfin = mes_actual.id;
      }
    });
    this.getConfAnio().then(() => {
      let anio = this.anio.find((f) => f.nombre == moment().format("YYYY"));
      if (anio != null) {
        this.model.anio = anio.id;
      }
    });
    this.getparametrosctas();
    this.getList_conceptos_conta();
  },
};
</script>

<style lang="scss">
.tabbordere {
  border: 1px solid lightgray;
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
  background: transparent linear-gradient(180deg, #d4e8f83d 0%, #d4e8f8 100%) 0% 0% no-repeat padding-box !important;
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

.espacio {
  border-bottom: 1px solid;
  margin-bottom: 33px;
  border-color: #d8d8d8;
}
</style>