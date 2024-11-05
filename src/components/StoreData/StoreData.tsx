import React, { useEffect, useState } from "react";
import { storeService } from "../../service/store.service";
import {
  Dropdown,
  Space,
  Select,
  Slider,
  InputNumber,
  Rate,
  Input,
} from "antd";
import { ItemType } from "antd/es/menu/interface";
import { BaseOptionType } from "antd/es/select";
interface IProductItem {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface Rating {
  rate: number;
  count: number;
}

const StoreData = () => {
  const [data, setData] = useState<IProductItem[]>([]);
  const [filterData, setFilterData] = useState<IProductItem[]>([]);
  const [menuCategory, setMenuCategory] = useState<BaseOptionType[]>();
  const [rangePrice, setRangePrice] = useState<number[]>([0, 0]);
  const [filterOption, setFilterOption] = useState({
    category: "",
    rangePrice: [0, 0],
    rating: 0,
    sortBy: "low",
  });
  const [searchByName, setSearchByName] = useState("");

  useEffect(() => {
    storeService
      .getAll()
      .then((res) => {
        console.log(res);
        setData(res.data);
        // thực hiện lọc lấy các category và không trùng nhau sau đó thêm vào menu
        const categories = res.data.map((item: IProductItem) => item.category);
        const uniqueCategories: string[] = Array.from(new Set(categories));
        const menu = uniqueCategories.map((item: string, index: number) => {
          return {
            label: item,
            value: item,
          };
        });
        setMenuCategory([...menu]);
        // lấy giá trị cao nhất và thấp nhất của giá sản phẩm
        const minPrice = Math.min(
          ...res.data.map((item: IProductItem) => item.price)
        );
        const maxPrice = Math.max(
          ...res.data.map((item: IProductItem) => item.price)
        );
        setRangePrice([minPrice, maxPrice]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSetFilterCategory = (value: string) => {
    setFilterOption({ ...filterOption, category: value });
  };

  useEffect(() => {
    let filter = filterOption.category
      ? data.filter((item) => item.category === filterOption.category)
      : data;
    // lọc theo range giá trong khoảng từ min đến max kiểm tra nếu max = 0 thì không lọc
    filter = filterOption.rangePrice[1]
      ? filter.filter(
          (item) =>
            item.price >= filterOption.rangePrice[0] &&
            item.price <= filterOption.rangePrice[1]
        )
      : filter;

    // lọc theo rating
    filter = filterOption.rating
      ? filter.filter((item) => {
          // lọc trong khoảng
          return item.rating.rate >= filterOption.rating;
        })
      : filter;

    // lọc theo giá tăng dần hoặc giảm dần và theo tên sản phẩm A-Z hoặc Z-A và theo rating tăng dần hoặc giảm dần
    switch (filterOption.sortBy) {
      case "low":
        filter.sort((a, b) => b.price - a.price);
        break;
      case "high":
        filter.sort((a, b) => a.price - b.price);
        break;
      case "az":
        filter.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        filter.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rateAsc":
        filter.sort((a, b) => a.rating.rate - b.rating.rate);
        break;
      case "rateDesc":
        filter.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    setFilterData(filter);
  }, [filterOption, data]);

  useEffect(() => {
    setFilterData(
      data.filter((item) =>
        item.title.toLowerCase().includes(searchByName.toLowerCase())
      )
    );
  }, [searchByName]);

  return (
    <div>
      <div className="container mx-auto">
        <div>
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <div className="filter-data space-y-3">
          <h3>
            Filter by: {filterOption.category ? filterOption.category : "All"}
          </h3>
          <Select
            placeholder="Category"
            onClear={() => {
              setFilterOption({ ...filterOption, category: "" });
            }}
            allowClear
            value={filterOption.category}
            className="w-40"
            onChange={handleSetFilterCategory}
            options={menuCategory}
          />
          <div className="w-1/2">
            <h3>
              Price: {filterOption.rangePrice[0]} - {filterOption.rangePrice[1]}
            </h3>
            <Slider
              min={rangePrice[0]}
              max={rangePrice[1]}
              onChange={(value) => {
                setFilterOption({
                  ...filterOption,
                  rangePrice: [0, value],
                });
              }}
            />
          </div>
          <div>
            <h3>Rating: </h3>
            <Rate
              allowHalf
              onChange={(value) => {
                setFilterOption({
                  ...filterOption,
                  rating: value,
                });
              }}
            />
          </div>
          <div className="flex items-center">
            {/* sort with price low to high and A to Z */}
            <h3>
              <i className="fa-solid fa-sort-amount-down"></i>
              Sort by Price:
            </h3>
            <Select
              onChange={(value: string) => {
                console.log("first");
                setFilterOption({
                  ...filterOption,
                  sortBy: value,
                });
              }}
              className="w-32"
              value={filterOption.sortBy}
            >
              <Select.Option value="low">Low to High</Select.Option>
              <Select.Option value="high">High to Low</Select.Option>
              <Select.Option value="az">A to Z</Select.Option>
              <Select.Option value="za">Z to A</Select.Option>
              <Select.Option value="rateAsc">
                <i className="fa-solid fa-star"></i> 1 to 5
              </Select.Option>
              <Select.Option value="rateDesc">
                <i className="fa-solid fa-star"></i> 5 to 1
              </Select.Option>
            </Select>
          </div>
        </div>
        <div>
          <Input
            onChange={(e) => {
              setSearchByName(e.target.value);
            }}
          />
        </div>
        <div className="grid grid-cols-5 gap-5">
          {filterData.map((item: IProductItem, key: number) => {
            return (
              <div className="mx-auto rounded-lg bg-white shadow-md duration-300 hover:shadow-lg p-5 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="w-full h-2/4 border border-gray-200 mx-auto overflow-hidden p-4 rounded-lg">
                    <img
                      className="w-full h-full object-contain hover:scale-110 duration-300"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>
                  <div>
                    <h2 className="mb-2 text-xl font-medium mt-2 text-gray-900 line-clamp-3 h-[84px]">
                      {item.title}
                    </h2>
                    <p className="mb-2 text-base text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center">
                      <p className="mr-2 text-2xl font-semibold text-gray-900 ">
                        ${item.price}
                      </p>
                      {item.rating.rate && (
                        <p className="text-base font-medium">
                          <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-1 text-xs font-semibold">
                            {item.rating.rate}
                          </span>

                          <span>
                            <i className="fa-solid fa-star text-yellow-500"></i>
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {item.rating.count && (
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium">
                        {item.rating.count} reviews
                      </p>
                    </div>
                  )}
                  <button className="mt-2 flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-4 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreData;
