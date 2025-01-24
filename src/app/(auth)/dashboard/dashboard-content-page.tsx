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

export default function DashboardContentPage() {
  const [categories, setCategories] = useState<IEventCategory[]>([]);
  const [newCategory, setNewCategory] = useState({ categoryName: "", color: "", emoji: "" });
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(newCategory.color);


  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
    setTempColor(newCategory.color);
  };
  
  const handleTempColorChange = (color: any) => {
    setTempColor(color.hex);
  };
  
  const handleSetColor = () => {
    setNewCategory((prev) => ({ ...prev, color: tempColor }));
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
    
    if (newCategory.categoryName === '' || newCategory.color === '') return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/event-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      
      const data: { eventCategory: IEventCategory } = await response.json();
      setCategories((prev) => [...prev, data.eventCategory]);
      setNewCategory({ categoryName: "", color: "", emoji: "" });
      setCreateNewCategory(!createNewCategory)
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCategory(categoryId: string) {
    try {
      setIsLoading(true);
  
      const response = await fetch(`/api/event-categories?id=${categoryId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error("Error deleting category:", data.message);
        return;
      }
  
      // Filter out the deleted category from the state
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  }  

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
        {/* Modal */}
        <div id="crud-modal" aria-hidden="true" className={`${createNewCategory && 'hidden'} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full h-screen md:inset-0 h-[calc(100%-1rem)] max-h-screen`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                          style={{ backgroundColor: newCategory?.color }}
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
                    <button onClick={handleCreateCategory} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Add new category
                    </button>
                    {
                      isLoading &&
                      <LoadingSpinner />
                    }
                  </div>
              </div>
          </div>
        </div>
      </MaxWidthWrapper>
    )
  }

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        <div className="flex items-start justify-between">
          <Heading variant="h2" className="mb-8">Event Categories</Heading>
          <button onClick={() => setCreateNewCategory(!createNewCategory)} className='px-5 py-2.5 text-white rounded-md bg-gray-700 hover:bg-gray-800'>
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
                  <div className="size-12 min-w-12 rounded-full" style={{ backgroundColor: category?.color ? `${category?.color}` : "#f4f4f4" }} />

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
                      {category.createdAt
                        ? formatDistanceToNow(category.createdAt) + " ago"
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <Database className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Unique fields:</span>
                    <span className="ml-1">{category ? 1 : 0}</span>
                  </div>
                  <div className="flex items-center text-sm/5 text-gray-600">
                    <BarChart2 className="size-4 mr-2 text-brand-500" />
                    <span className="font-medium">Events this month:</span>
                    <span className="ml-1">{categories.length || 0}</span>
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
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${category.name} category`}
                    onClick={() => deleteCategory(category?._id)}
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
      <div id="crud-modal" aria-hidden="true" className={`${createNewCategory && 'hidden'} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full h-screen md:inset-0 h-[calc(100%-1rem)] max-h-screen`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                        style={{ backgroundColor: newCategory?.color }}
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
                  <button onClick={handleCreateCategory} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                      Add new category
                  </button>
                  {
                    isLoading &&
                    <LoadingSpinner />
                  }
                </div>
            </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
