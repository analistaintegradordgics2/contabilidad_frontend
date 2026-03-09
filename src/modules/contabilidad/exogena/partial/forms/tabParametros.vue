<template>
    <q-tab-panel name="tabParametros">
        <div class="row col-12 items-center q-mb-sm">
          <div class="flex items-center">

            <l-money
              prefijo="$ "
              sufijo=""
              @input="updateCuantia(valor_cuantia)"
              v-model="valor_cuantia"
              label="Cuantia minima:"
              :rules="[]"
              icon="monetization_on"
              :disable="['',undefined,null].includes(valCuantia)"
            />
            <l-input
                  v-if="![undefined,null].includes(valFactor)"
                  style="padding: 0;"
                  v-model="valor_factor"
                  label="Factor:"
                  type="number"
                  @input="updateFactor(valor_factor)"
                  icon="tag"
                />
          </div>
          <q-separator class="" />
          <div class="flex justify-end q-ml-md items-center">
            <div class="flex items-center">
            <q-btn unelevated round dense color="amber" @click="onSubmit" class="q-mr-sm" >
              <q-icon name="mdi-content-save" color="white" />
              <q-tooltip>Guardar</q-tooltip>
            </q-btn>
            </div>
            <div v-if="![5247,5251,5252].includes(formato)" class="flex justify-end items-center q-my-sm">
              <q-btn
                unelevated
                color="red"
                icon="delete"
                rounded
                size="md"
                v-if="datos.some((x) => x.select)"
                class="q-mr-sm"
                label="Eliminar"
                @click="onDelete"
              />
              <!-- <q-btn
                unelevated
                color="green"
                icon="save"
                rounded
                size="md"
                class="q-mr-sm"
                label="Guardar"
                v-if="datos.length > 0"
                @click="onSubmit"
              /> -->
              <q-btn
                unelevated
                color="primary"
                icon="add"
                rounded
                size="md"
                class="q-mr-sm"
                label="Agregar"
                @click="addParam"
              />
            </div>
            <!-- <div v-else class="flex justify-end q-my-sm">
              <q-btn
                unelevated
                color="green"
                icon="save"
                rounded
                size="md"
                class="q-mr-sm"
                label="Guardar"
                @click="onSubmit"
              /> 
            </div>   
            <q-btn
              unelevated
              color="red"
              icon="delete"
              rounded
              size="md"
              v-if="datos.some((x) => x.select)"
              class="q-mr-sm"
              label="Eliminar"
              @click="onDelete"
            /> -->
          </div>
        </div>
         
          <q-table
            flat
            bordered
            dense
            row-key="name"
            :data="datos"
            :columns="columns"
            :rows-per-page-options="[0]"
            :pagination.sync="pagination"
          >
            <template v-slot:top-left>
              <!-- <l-money
                  v-if="!['',undefined,null].includes(valCuantia)"
                  col="md-3 text-black"
                  prefijo="$ " 
                  class="q-pa-sm"                 
                  sufijo=""
                  @input="updateCuantia(valor_cuantia)"
                  v-model="valor_cuantia"
                  label="Cuantia minima:"
                  :rules="[]"
                  icon="monetization_on"
                /> -->
                              
            </template>
            <template v-slot:header="props" >
              <q-tr :props="props">
                <q-th>
                  <q-checkbox
                    size="sm"
                    color="amber"
                    v-model="selectall"
                    :val="true"
                    @input="selectAll($event)"
                  />
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }} </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr>
                <q-td auto-width align="center">
                  <q-checkbox v-model="props.row.select" />
                </q-td>
                <td>
                    <l-input
                      class="q-pt-sm"
                      v-model="props.row.cdian"
                      type="number"
                      :rules="[(val) => !!val || 'Este campo es requerido']"
                  />
                </td>
                <q-td>
                    <l-select
                      class="q-pt-sm"
                      :options="mayor"
                      option-label="codigo_nombre"
                      option-value="id"
                      @input="searchAccount(props.row,props.rowIndex)"
                      v-model="props.row.mayor_id"
                      :clearable="false"
                      :rules="[(val) => !!val || 'Este campo es requerido']"
                    />
                </q-td>
                <q-td>
                    <l-input
                      class="q-pt-sm"
                      v-model="props.row.detalle"
                      type="textarea"
                      :rules="[(val) => !!val || 'Este campo es requerido']"
                    />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          {{ computedValues }}
      </q-tab-panel>
</template>

<script>
import Swal from 'sweetalert2/src/sweetalert2.js'
export default {
  layout: 'main',
  name: 'tabParametros',
  props: {
    datos: {
      type: Array
    },
    mayor: {
      type: Array
    },
    valCuantia: {
      type: Number
    },
    valFactor: {
      type: Number
    },
    formato: {
      type: Number
    }
  },
  data () {
    return {
      valor_cuantia: 0,
      valor_factor: 0,
      selectall: false,
      columns: [
        { name: 'concepto_dian', align: 'left', label: 'Concepto Dian', field: 'concepto_dian' },
        { name: 'cuenta', align: 'left', label: 'Código - Cuenta', field: 'cuenta' },
        { name: 'detalle', align: 'left', label: 'Detalle', field: 'detalle' }
      ],
      pagination: {
        rowsPerPage: 100
      }
    }
  },
  computed: {
    computedValues() {
    if (this.valCuantia) {
      this.valor_cuantia = this.valCuantia;
    }
    if (this.valFactor) {
      this.valor_factor = this.valFactor;
    }
  }
  },
  methods: {
    searchAccount ({ mayor_id }, index) {
      this.$emit('update-detail', mayor_id, index)
    },
    async onSubmit () {
      this.LConfim('¿Desea guardar estos parámetros?', async () => {
        try {
          const resp = await this.Post('contabilidad/exogena/updateParams', { params: this.datos, valCuantia: this.valCuantia ? this.valCuantia : null, valFactor: this.valFactor ? this.valFactor : null, formato : this.formato })
          if (resp.success) {
            this.LFinish(`${resp.success}`,() => {}, false);
          }
        } catch (error) {
          console.error('Error en la petición:', error)
        }
      })
    },
    updateCuantia (val) {
      this.$emit('update-cuantia', val)
    },
    updateFactor (val) {
      this.$emit('update-factor', val)
    },
    selectAll (evnt) {
      this.datos.forEach(element => {
        element.select = evnt ? true : false
      });
    },
    onDelete () {
      this.LConfim(`¿Está seguro de eliminar los parametros seleccionados?`, async () => {
        this.$emit('delete-params', [...new Set(this.datos.filter((x) => x.select).map(item => item.id))])
      })
    },
    addParam () {
      const payload = { id: null, cdian: null, mayor_id: null, detalle: null, select: false }
      this.LConfim(`¿Desea agregar un nuevo parametro?`, async () => {
        this.$emit('add-params', payload)
      })
    }
  },
  // mounted () {
  //   setTimeout(() => {
  //     if (this.valCuantia) this.valor_cuantia = this.valCuantia
  //     if (this.valFactor) this.valor_factor = this.valFactor
  //   }, 1509)
  // }
}
</script>
<style lang="scss">
.itemexpand .q-item {
  padding: 0px !important;
}
.stylelist {
  border: 1px solid #6bb7e0 !important;
  box-shadow: 0px 2px 5px #42a5f538;
  opacity: 1;
}
.styleopciones {
  background: #f9f9f9 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #42a5f538;
  opacity: 1;
  padding: 11px !important;
  font-weight: bold;
  border-radius: 20px;
  color: #194880;
  /* border-radius: 11px !important; */
}
.stylelis {
  border: 1px solid #6bb7e0 !important;
}


.q-tab__label {
  font-size: 16px;
}
.espaciotab {
  border-bottom: 1px solid;
  border-color: #d8d8d8;
  padding-top: 35px;
}
.q-tab--active {
  & .q-tab__label {
    color: #194880;
    font-weight: bold;
  }
}
.q-field--with-bottom {
  padding: 0;
}

</style>

