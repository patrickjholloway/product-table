/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { applyFieldOverrides, DataFrame, FieldType, GrafanaTheme2, ThresholdsMode, Vector } from "@grafana/data";
import { PanelContainer, Table, TableCellDisplayMode, useTheme2 } from "@grafana/ui";
import { FC } from "react"
import { Product } from "../contexts/products"

const styles = {
    wrapper: css`
        margin: auto;
        padding: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        `
}

const mapBy = (fieldName: string) => {
    return (row: any) => {
        const rowValue = row[fieldName]
        if (fieldName === 'images' && rowValue) {
            return rowValue[0];
        }
        return rowValue;
    }
}

class ProductVector implements Vector {
    private rawValues: any[]
    length: number;
    constructor(rows: any[], fieldName: string) {
        this.rawValues = rows.map(mapBy(fieldName));
        this.length = this.rawValues.length;
    }

    get(i: number) {
        return this.rawValues[i];
    }

    toArray(): any[] {
        return this.rawValues;
    }
}

function buildData(theme: GrafanaTheme2, rows: Product[]): DataFrame {
    let data: DataFrame = ({
        fields: [
            {
                name: 'id', type: FieldType.number, values: new ProductVector(rows, 'id'), config: {
                    custom: {
                        align: 'center',
                    }
                }
            },
            {
                name: 'Title',
                type: FieldType.string,
                values: new ProductVector(rows, 'title'), config: {
                    custom: {
                        align: 'center',
                    },
                },
            },
            {
                name: 'Price',
                type: FieldType.string,
                values: new ProductVector(rows, 'price'), config: {
                    custom: {
                        align: 'center',
                    },
                },

            },
            {
                name: 'Discount %',
                type: FieldType.number,
                values: new ProductVector(rows, 'discountPercentage'), config: {
                    unit: 'percent',
                    custom: {
                        align: 'center',
                    },
                },
            },
            {
                name: 'Rating',
                type: FieldType.number,
                values: new ProductVector(rows, 'rating'), config: {
                    custom: {
                        align: 'center',
                        displayMode: TableCellDisplayMode.BasicGauge,
                    },
                    min: 0,
                    max: 5,
                    thresholds: {
                        mode: ThresholdsMode.Absolute,
                        steps: [{ value: 1, color: 'red' }, { value: 2, color: 'orange' }, { value: 3, color: 'yellow' }, { value: 4, color: 'blue' }, { value: 5, color: 'green' }],
                    },
                },
            },
            {
                name: 'Stock',
                type: FieldType.string,
                values: new ProductVector(rows, 'stock'), config: {
                    custom: {
                        align: 'center',
                    },
                },
            },
            {
                name: 'Brand',
                type: FieldType.string,
                values: new ProductVector(rows, 'brand'), config: {
                    custom: {
                        align: 'center',
                    },
                },
            },
            {
                name: 'Category',
                type: FieldType.string,
                values: new ProductVector(rows, 'category'), config: {
                    custom: {
                        align: 'center',
                    },
                },
            },
            {
                name: 'Thumbnails',
                type: FieldType.string,
                values: new ProductVector(rows, 'images'), config: {
                    custom: {
                        align: 'center',
                        displayMode: TableCellDisplayMode.Image
                    },

                },
            },
        ],
        length: rows.length
    });


    data = applyFieldOverrides({
        data: [data],
        theme,
        replaceVariables: (v: string) => v,
        fieldConfig: {
            defaults: {},
            overrides: [],
        },
    })[0];

    return data;
};

interface ProductsTableProps { products: Product[], loading: boolean, errors: string[] };

export const ProductsTable: FC<ProductsTableProps> = ({ products }) => {
    const theme = useTheme2();
    const data = buildData(theme, products);

    return <div css={styles.wrapper}>
        <PanelContainer title={'Products'}>
            <Table data={data} width={1400} height={38 * data.length}></Table>
        </PanelContainer>
    </div>

}
