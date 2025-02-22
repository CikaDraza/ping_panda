"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/app/components/max-width-wrapper";
import { IEventCategory } from "@/server/models/EventCategory";
import { format, formatDistanceToNow } from "date-fns"
import Heading from "@/app/components/heading";
import LoadingSpinner from "@/app/components/loading-spinner";
import { ArrowRight, BarChart2, Clock, Database, Pipette, SmilePlus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { ChromePicker } from "react-color";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

const hexToInt32 = (hex: string) => {
  return parseInt(hex.replace("#", ""), 16);
};  

const int32ToHex = (int: number) => {
  return `#${int.toString(16).padStart(6, "0")}`;
}; 

export default function DashboardContentPage() {
  const [categories, setCategories] = useState<IEventCategory[]>([]);
  const [newCategory, setNewCategory] = useState({ categoryName: "", color: 0, emoji: "" });
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(int32ToHex(newCategory.color));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);  

  useEffect(() => {
    setTempColor(int32ToHex(newCategory.color));
  }, [newCategory.color]);  

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
    setTempColor(int32ToHex(newCategory.color));
  };
  
  const handleTempColorChange = (color: any) => {
    setTempColor(color.hex);
  }; 
  
  const handleSetColor = () => {
    const colorInt = hexToInt32(tempColor);
    setNewCategory((prev) => ({ ...prev, color: colorInt }));
    setShowColorPicker(false);
  }; 

  const handleEmojiClick = (emojiData: { emoji: any; }) => {
    setNewCategory({
      ...newCategory,
      emoji: emojiData.emoji,
    });
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/event-categories");
        const data: IEventCategory[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleCreateCategory() {
    
    if (newCategory.categoryName === '' || newCategory.color === 0) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/event-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      
      const data: { eventCategory: IEventCategory } = await response.json();
      setCategories((prev) => [...prev, data.eventCategory]);
      setNewCategory({ categoryName: "", color: 0, emoji: "" });
      setCreateNewCategory(!createNewCategory)
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCategory() {    
    try {
      setIsLoading(true);
  
      const response = await fetch(`/api/event-categories?id=${selectedCategoryId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error("Error deleting category:", data.message);
        return;
      }
  
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== selectedCategoryId)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  };

  if (categories.length === 0) {
    return (
      <MaxWidthWrapper className="pt-8">
        <button onClick={() => setCreateNewCategory(!createNewCategory)} className='px-5 py-2.5 mb-4 text-white rounded-md bg-gray-700 hover:bg-gray-800'>
          Create New Category
        </button>
        <div className="flex items-center">
          <Heading variant="h2">Event Categories:<span className="mr-4 text-red-500"> is Empty</span></Heading>
          {
            isLoading &&
            <LoadingSpinner />
          }
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center mt-12">
          <div className="flex justify-center w-full">
            <Image
              src="/images/wolfy.png"
              alt="No categories"
              width={192}
              height={192}
              className="size-48"
            />
          </div>

          <Heading variant="h3" className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
            No Event Categories Yet
          </Heading>

          <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
            Start tracking events by creating your first category.
          </p>
        </div>

        {/* Modal */}
        {
          createNewCategory &&
          <div id="crud-modal" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full h-screen md:inset-0 h-[calc(100%-1rem)] max-h-screen" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="relative p-4 w-full max-w-md m-auto max-h-full">
                <div className="relative bg-white rounded-lg shadow-md dark:bg-gray-700">

                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Create a category to organize your events.
                        </h3>
                        <button onClick={() => setCreateNewCategory(!createNewCategory)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                            <X />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="grid p-4 md:p-5 gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Type Category Name"
                          value={newCategory.categoryName}
                          onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Color</label>
                        <div className="flex items-center">
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 mr-2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            disabled
                            style={{ backgroundColor: int32ToHex(newCategory?.color) }}
                          />
                          {
                            showColorPicker ? 
                            <button className="text-xs border p-1 rounded-lg" onClick={handleSetColor}>
                              Set Color
                            </button>
                          :
                            <button onClick={handleColorPickerToggle}>
                              <Pipette />
                            </button>
                          }
                        </div>
                        
                        {
                          showColorPicker && (
                            <div className="absolute mt-2">
                              <ChromePicker color={tempColor} onChange={handleTempColorChange} />
                            </div>
                          )
                        }
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="emoji" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emoji</label>
                        <div
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          style={{ cursor: "pointer", fontSize: "24px" }}
                          className="flex items-center"
                        >
                          <input type="text" name="emoji" id="emoji" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 mr-2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Add category emoji" value={newCategory.emoji} />
                          <SmilePlus />
                        </div>
                        {showEmojiPicker && (
                          <div className="absolute mt-2 top-0">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </div>
                        )}
                      </div>
                      <div className="col-span-2/3 lg:col-span-1">
                        <button onClick={handleCreateCategory} className="col-span-1 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                            Add new category
                        </button>
                      </div>
                      <div className="col-span-1/3 lg:col-span-1 flex items-center">
                        {
                          isLoading &&
                          <LoadingSpinner />
                        }
                      </div>
                    </div>
                </div>
            </div>
          </div>
        }
      </MaxWidthWrapper>
    )
  }

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-between mb-8 lg-mb-0">
          <Heading variant="h2" className="mb-8">Event Categories</Heading>
          <button onClick={() => setCreateNewCategory(!createNewCategory)} className='px-5 py-2.5 text-white rounded-md bg-gray-700 hover:bg-gray-800 w-full lg:w-auto'>
            Create New Event Category
          </button>
        </div>
        <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <li key={category.name} className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5">
              <div className="absolute z-0 inset-px rounded-lg bg-white" />

              <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-hover duration-300 group-hover:shadow-md ring-1 ring-black/5" />

              <div className="relative p-6 z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 min-w-12 rounded-full" style={{ backgroundColor: category?.color ? `${int32ToHex(category?.color)}` : "#f4f4f4" }} />

                  <div>
                    <Heading variant="h3" className="sm:text-md">
                      {category.emoji || "📂"} {category.name}
                    </Heading>
                    <p className="text-sm/6 text-gray-600">
                      {format(category.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                 
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <Clock className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Last ping:</span>
                    <span className="ml-1">
                      {category.lastPing
                        ? formatDistanceToNow(new Date(category.lastPing)) + " ago"
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <Database className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Unique fields:</span>
                    <span className="ml-1">{category.uniqueFields || 0}</span>
                  </div>
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <BarChart2 className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Events this month:</span>
                    <span className="ml-1">{category.eventsThisMonth || 0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Link
                    href={`/dashboard/category/${category.name}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    View all <ArrowRight className="size-4" />
                  </Link>
                  <button
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${category.name} category`}
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="size-5" />
                  </button>
                  
                </div>

              </div>
            </li>
          ))}
        </ul>        
      </div>

      {/* Modal */}
      {
        createNewCategory &&
        <div id="crud-modal" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full h-screen md:inset-0 h-[calc(100%-1rem)] max-h-screen" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="relative p-4 w-full max-w-md m-auto max-h-full">
              <div className="relative bg-white rounded-lg shadow-md dark:bg-gray-700">

                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create a category to organize your events.
                      </h3>
                      <button onClick={() => setCreateNewCategory(!createNewCategory)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                          <X />
                          <span className="sr-only">Close modal</span>
                      </button>
                  </div>

                  <div className="grid p-4 md:p-5 gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Type Category Name"
                        value={newCategory.categoryName}
                        onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Color</label>
                      <div className="flex items-center">
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 mr-2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
                          style={{ backgroundColor: int32ToHex(newCategory?.color) }}
                        />
                        {
                          showColorPicker ? 
                          <button className="text-xs border p-1 rounded-lg hover:bg-gray-100" onClick={handleSetColor}>
                            Set Color
                          </button>
                        :
                          <button onClick={handleColorPickerToggle}>
                            <Pipette />
                          </button>
                        }
                      </div>
                      
                      {
                        showColorPicker && (
                          <div className="absolute mt-2">
                            <ChromePicker color={tempColor} onChange={handleTempColorChange} />
                          </div>
                        )
                      }
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="emoji" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Emoji</label>
                      <div
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        style={{ cursor: "pointer", fontSize: "24px" }}
                        className="flex items-center"
                      >
                        <input type="text" name="emoji" id="emoji" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 mr-2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Add category emoji" value={newCategory.emoji} />
                        <SmilePlus />
                      </div>
                      {showEmojiPicker && (
                        <div className="absolute mt-2 top-0">
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <button onClick={handleCreateCategory} className="col-span-1 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                          Add new category
                      </button>
                    </div>
                    <div className="col-span-1 absolute bottom-5 right-12 lg:static lg:col-span-1 flex items-center">
                      {
                        isLoading &&
                        <LoadingSpinner />
                      }
                    </div>
                  </div>
              </div>
          </div>
        </div>
      }

      {/* Confirm delete Modal */}
      {
        isModalOpen && (
          <div id="popup-modal" className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full h-screen" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="relative p-4 w-full max-w-md m-auto max-h-full">
                  <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                      <button onClick={() => setIsModalOpen(false)} type="button" className="absolute z-50 top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                      <div className="p-4 md:p-5 text-center">
                          <div className="relative mx-auto mb-4">
                            <svg className="mx-auto mb-4 text-gray-400 size-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke={isLoading ? "red" : "currentColor"} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            {
                              isLoading &&
                              <div className="absolute w-full h-12 top-0 flex justify-center items-center">
                                <span className="absolute size-12 animate-ping rounded-full bg-red-600 opacity-75"></span>
                              </div>
                            }
                          </div>
                          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this category?</h3>
                          <button onClick={deleteCategory} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                              Yes, I'm sure
                          </button>
                          <button onClick={() => setIsModalOpen(false)} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                      </div>
                  </div>
              </div>
          </div>
        )
      }
    </MaxWidthWrapper>
  );
}
