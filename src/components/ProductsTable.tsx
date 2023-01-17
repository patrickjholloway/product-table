/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { DataFrame, FieldType, getDisplayProcessor, GrafanaTheme2, MutableDataFrame, Vector } from "@grafana/data";
import { PanelContainer, Table, useTheme2 } from "@grafana/ui";
import { FC } from "react"
import { Product } from "../contexts/products"

const mapBy = (fieldName: string) => {
    return (row: any) => {
        return row[fieldName];
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
    const data: DataFrame = ({
        fields: [
            { name: 'id', type: FieldType.number, values: new ProductVector(rows, 'id'), config: {} },
            {
                name: 'Description',
                type: FieldType.string,
                values: new ProductVector(rows, 'description'), config: {},
            },
            {
                name: 'Price',
                type: FieldType.string,
                values: new ProductVector(rows, 'price'), config: {},

            },
            {
                name: 'Discount %',
                type: FieldType.string,
                values: new ProductVector(rows, 'discountPercentage'), config: {},
            },
        ], length: 4
    });
    data.fields.forEach(field => {
        field.display = getDisplayProcessor({ field, theme });
    });
    return data;
};


interface ProductsTableProps { products: Product[], loading: boolean, errors: string[] };

export const ProductsTable: FC<ProductsTableProps> = ({ products, loading, errors }) => {
    const theme = useTheme2();
    const data = buildData(theme, products);

    const styles = {
        wrapper: css`background-color: ${theme.colors.background.primary};`
    }

    return <div css={styles.wrapper}>
        <PanelContainer>
            <h2>{products.length} Products</h2>
            <Table data={data} width={1500} height={500}></Table>
        </PanelContainer>
    </div>

}
