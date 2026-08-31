export interface ILiquiditySourceProtocol {
  id: string;
  title: string;
  img: string;
}

export interface ILiquiditySourcesDTO {
  protocols: ILiquiditySourceProtocol[];
}
